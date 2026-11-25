<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, toRaw, useId, watch } from 'vue'
import { cn } from '@ousi-ui/core'
import { useOusiConfig, useOusiMessages } from '../../config'
import { OButton } from '../button'
import { OSelect } from '../select'
import { OSlider } from '../slider'
import { formatFileSize } from '../file-upload/file-upload.utils'
import {
  clamp,
  flipEdit,
  initialEdit,
  largestCrop,
  moveCrop,
  pixelCrop,
  reshapeCrop,
  resizeCrop,
  rotateEdit,
  setZoom,
  smallestSide,
  turnedSize,
  viewOf,
  zoomCrop,
  zoomOf,
  type EditState,
  type Handle,
  type Rect,
  type Size,
} from './image-editor.geometry'
import { exportEdit, type EditedFile } from './image-editor.render'
import {
  imageEditorFrameTheme,
  imageEditorHandleTheme,
  imageEditorMarkTheme,
  imageEditorStageTheme,
} from './image-editor.theme'
import type { ImageEditorEmits, ImageEditorOutput, ImageEditorProps, ImageEditorRatio } from './image-editor.types'
import type { CompressImageType } from '../../image'

const props = withDefaults(defineProps<ImageEditorProps>(), {
  src: undefined,
  aspectRatio: undefined,
  aspectRatios: undefined,
  shape: 'rect',
  hideOutputSettings: false,
  maxSize: undefined,
  maxDimension: undefined,
  type: undefined,
  quality: undefined,
})
const emit = defineEmits<ImageEditorEmits>()

const ousiText = useOusiMessages()
const ousiConfig = useOusiConfig()
const hintId = useId()

/** Room around the frame, so its handles stay inside the stage. */
const PADDING = 24
const HANDLES: Handle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
const SIZES = [2048, 1600, 1024, 512]
const SETTLE = 'transition-[left,top,width,height] duration-200 ease-out motion-reduce:transition-none'

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
const formatSize = (bytes: number) => formatFileSize(bytes, ousiConfig.locale.value)

/* ── Shape ─────────────────────────────────────────────────────── */

const ratios = computed<ImageEditorRatio[]>(
  () =>
    props.aspectRatios ?? [
      { label: ousiText.value.freeRatio },
      { label: '1:1', value: 1 },
      { label: '4:3', value: 4 / 3 },
      { label: '3:4', value: 3 / 4 },
      { label: '16:9', value: 16 / 9 },
    ],
)
const fixedRatio = computed(() => (props.shape === 'circle' ? 1 : props.aspectRatio))
const chosenRatio = ref<number>()
const ratio = computed(() => fixedRatio.value ?? chosenRatio.value)

/* ── The picture ───────────────────────────────────────────────── */

const picture = shallowRef<{ file: File; url: string }>()
const natural = shallowRef<Size>()
const state = shallowRef<EditState>()
const failed = ref(false)
/** Set by anything the user changes. */
const touched = ref(false)

/* ── Output settings ───────────────────────────────────────────── */

const defaultQuality = computed(() => Math.round((props.quality ?? 0.9) * 100))
const sizeChoice = ref<string | number>('full')
const formatChoice = ref<string | number>('auto')
const qualityChoice = ref(defaultQuality.value)
const writesWebp = ref(false)

const output = computed<ImageEditorOutput>(() => {
  const side = typeof sizeChoice.value === 'number' ? sizeChoice.value : undefined
  return {
    maxSize: props.maxSize,
    maxDimension: side ?? props.maxDimension,
    type: formatChoice.value === 'auto' ? props.type : (formatChoice.value as CompressImageType),
    quality: qualityChoice.value === defaultQuality.value ? props.quality : qualityChoice.value / 100,
  }
})

const sizeOptions = computed(() => {
  const longest = natural.value ? Math.max(natural.value.width, natural.value.height) : 0
  const limit = Math.min(longest, props.maxDimension ?? Infinity)
  return [
    { value: 'full', label: ousiText.value.fullSize },
    ...SIZES.filter((side) => side < limit).map((side) => ({ value: side, label: `${side} px` })),
  ]
})
const formatOptions = computed(() => [
  { value: 'auto', label: ousiText.value.automaticFormat },
  { value: 'image/jpeg', label: 'JPG' },
  { value: 'image/png', label: 'PNG' },
  ...(writesWebp.value ? [{ value: 'image/webp', label: 'WebP' }] : []),
])

function resetSettings() {
  sizeChoice.value = 'full'
  formatChoice.value = 'auto'
  qualityChoice.value = defaultQuality.value
}

function change(setting: () => void) {
  touched.value = true
  setting()
}

/* ── Opening ───────────────────────────────────────────────────── */

let opening = 0

function releasePicture() {
  if (picture.value) URL.revokeObjectURL(picture.value.url)
  picture.value = undefined
}

async function toFile(src: File | Blob | string): Promise<File> {
  if (typeof src !== 'string') {
    const raw = toRaw(src)
    return raw instanceof File ? raw : new File([raw], 'image', { type: raw.type })
  }
  const response = await fetch(src)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const blob = await response.blob()
  const name = new URL(src, window.location.href).pathname.split('/').pop()
  return new File([blob], name ? decodeURIComponent(name) : 'image', { type: blob.type })
}

function fail(error: unknown) {
  failed.value = true
  state.value = undefined
  emit('error', error)
}

async function open() {
  const turn = ++opening
  stopEstimate()
  releasePicture()
  natural.value = undefined
  state.value = undefined
  estimate.value = undefined
  failed.value = false
  touched.value = false
  chosenRatio.value = ratios.value[0]?.value
  resetSettings()
  if (!props.src) return
  try {
    const file = await toFile(props.src)
    if (turn !== opening) return
    picture.value = { file, url: URL.createObjectURL(file) }
  } catch (error) {
    if (turn === opening) fail(error)
  }
}

// The <img> of the stage does the decoding, so what is measured is what is shown, already upright.
function onImageLoad(event: Event) {
  const image = event.target as HTMLImageElement
  if (!image.naturalWidth || !image.naturalHeight) return fail(new Error('The image is empty'))
  natural.value = { width: image.naturalWidth, height: image.naturalHeight }
  state.value = initialEdit(natural.value, ratio.value)
  emit('ready')
}
const onImageError = () => fail(new Error('The browser cannot open this image'))

watch(() => props.src, open)
watch(fixedRatio, (value) => {
  if (natural.value && state.value) state.value = initialEdit(natural.value, value ?? chosenRatio.value)
})

/* ── Editing ───────────────────────────────────────────────────── */

const bounds = computed<Size>(() =>
  natural.value && state.value ? turnedSize(natural.value, state.value.rotation) : { width: 0, height: 0 },
)

function setCrop(crop: Rect) {
  if (!state.value) return
  touched.value = true
  state.value = { ...state.value, crop }
}

function rotate(clockwise = true) {
  if (!state.value || !natural.value) return
  const next = rotateEdit(state.value, natural.value, clockwise)
  // A locked shape stays as it was chosen, though the picture turned under it.
  next.crop = reshapeCrop(next.crop, ratio.value, turnedSize(natural.value, next.rotation))
  touched.value = true
  state.value = next
}

function flip(axis: 'horizontal' | 'vertical') {
  if (!state.value || !natural.value) return
  touched.value = true
  state.value = flipEdit(state.value, natural.value, axis)
}

function selectRatio(value: number | undefined) {
  chosenRatio.value = value
  if (state.value && value) setCrop(reshapeCrop(state.value.crop, value, bounds.value))
}

function reset() {
  if (!natural.value) return
  chosenRatio.value = ratios.value[0]?.value
  resetSettings()
  state.value = initialEdit(natural.value, ratio.value)
  touched.value = false
}

const zoom = computed(() => (state.value ? zoomOf(state.value.crop, bounds.value) : 1))
const maxZoom = computed(() => {
  if (!state.value) return 1
  const shape = state.value.crop.width / state.value.crop.height
  const least = smallestSide(bounds.value)
  return clamp(largestCrop(bounds.value, shape).width / Math.max(least, least * shape), 1, 10)
})
function onZoom(value: number | [number, number]) {
  if (state.value) setCrop(setZoom(state.value.crop, value as number, bounds.value))
}

/* ── The stage ─────────────────────────────────────────────────── */

const stage = ref<HTMLElement | null>(null)
const frame = ref<HTMLElement | null>(null)
const stageSize = shallowRef<Size>({ width: 0, height: 0 })
/** The view is held still while a handle is dragged, so the frame follows the pointer. */
const heldView = shallowRef<ReturnType<typeof viewOf>>()
const interacting = ref(false)
const settling = ref(false)
let settleTimer: ReturnType<typeof setTimeout> | undefined

// clientWidth, not the bounding box: a dialog is still scaling in when the editor appears.
function measure() {
  if (!stage.value) return
  stageSize.value = { width: stage.value.clientWidth, height: stage.value.clientHeight }
}

const view = computed(() => {
  if (heldView.value) return heldView.value
  return state.value ? viewOf(state.value.crop, stageSize.value, PADDING) : { scale: 0, x: 0, y: 0 }
})

const px = (value: number) => `${value}px`
const pictureStyle = computed(() => ({
  left: px(view.value.x),
  top: px(view.value.y),
  width: px(bounds.value.width * view.value.scale),
  height: px(bounds.value.height * view.value.scale),
}))
const imageStyle = computed(() => {
  if (!natural.value || !state.value) return { opacity: 0 }
  const { rotation, flipX, flipY } = state.value
  return {
    width: px(natural.value.width * view.value.scale),
    height: px(natural.value.height * view.value.scale),
    // Applied right to left: turned, then mirrored as seen, then centred. The export paints alike.
    transform: `translate(-50%, -50%) scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1}) rotate(${rotation}deg)`,
  }
})
const frameStyle = computed(() => {
  if (!state.value) return {}
  const { crop } = state.value
  const { x, y, scale } = view.value
  return {
    left: px(x + crop.x * scale),
    top: px(y + crop.y * scale),
    width: px(crop.width * scale),
    height: px(crop.height * scale),
  }
})

/* ── Pointer: drag, resize, pinch ──────────────────────────────── */

type Point = { x: number; y: number }
type Gesture =
  | { kind: 'pan'; id: number; start: Point; crop: Rect; scale: number }
  | { kind: 'resize'; id: number; start: Point; crop: Rect; scale: number; handle: Handle }
  | { kind: 'pinch'; start: Point; distance: number; crop: Rect; focus: Point }

const pointers = new Map<number, Point>()
let gesture: Gesture | undefined

const between = ([a, b]: Point[]) => ({
  middle: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
  distance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
})

/** Where a screen point falls inside the frame, as fractions of it. */
function insideFrame(point: Point): Point {
  const box = frame.value?.getBoundingClientRect()
  if (!box?.width || !box.height) return { x: 0.5, y: 0.5 }
  return {
    x: clamp((point.x - box.left) / box.width, 0, 1),
    y: clamp((point.y - box.top) / box.height, 0, 1),
  }
}

function startDrag(id: number, handle?: Handle) {
  const start = pointers.get(id)!
  const base = { id, start, crop: state.value!.crop, scale: view.value.scale }
  if (handle) {
    heldView.value = view.value
    gesture = { kind: 'resize', handle, ...base }
  } else gesture = { kind: 'pan', ...base }
}

function onPointerDown(event: PointerEvent) {
  if (!state.value || event.button > 0) return
  // Keeps the browser from selecting text or dragging the picture away.
  event.preventDefault()
  frame.value?.focus({ preventScroll: true })
  stage.value?.setPointerCapture?.(event.pointerId)
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  interacting.value = true
  settling.value = false

  if (pointers.size === 2) {
    heldView.value = undefined
    const { middle, distance } = between([...pointers.values()])
    gesture = { kind: 'pinch', start: middle, distance, crop: state.value.crop, focus: insideFrame(middle) }
  } else if (pointers.size === 1) {
    const handle = (event.target as Element).closest('[data-handle]')?.getAttribute('data-handle')
    startDrag(event.pointerId, (handle as Handle | null) ?? undefined)
  }
}

function onPointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId) || !state.value) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (!gesture) return

  if (gesture.kind === 'pinch') {
    if (pointers.size < 2) return
    const { middle, distance } = between([...pointers.values()])
    const zoomed = zoomCrop(gesture.crop, distance / gesture.distance, bounds.value, gesture.focus)
    const { scale } = viewOf(zoomed, stageSize.value, PADDING)
    // Two fingers can also carry the picture while they zoom.
    setCrop(moveCrop(zoomed, (gesture.start.x - middle.x) / scale, (gesture.start.y - middle.y) / scale, bounds.value))
    return
  }
  if (event.pointerId !== gesture.id || !gesture.scale) return
  const dx = (event.clientX - gesture.start.x) / gesture.scale
  const dy = (event.clientY - gesture.start.y) / gesture.scale
  // Dragging carries the picture under a still frame, so the crop goes the opposite way.
  if (gesture.kind === 'pan') setCrop(moveCrop(gesture.crop, -dx, -dy, bounds.value))
  else setCrop(resizeCrop(gesture.crop, gesture.handle, dx, dy, bounds.value, ratio.value))
}

function onPointerEnd(event: PointerEvent) {
  if (!pointers.delete(event.pointerId)) return
  // A pinch that loses a finger goes on as a drag with the other one.
  if (gesture?.kind === 'pinch' && pointers.size === 1) return startDrag([...pointers.keys()][0])
  if (pointers.size > 0) return
  gesture = undefined
  interacting.value = false
  if (heldView.value) {
    // The new frame glides to the middle.
    settling.value = true
    heldView.value = undefined
    clearTimeout(settleTimer)
    settleTimer = setTimeout(() => (settling.value = false), 220)
  }
}

function onWheel(event: WheelEvent) {
  if (!state.value) return
  // Some browsers count the wheel in lines.
  const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY
  setCrop(zoomCrop(state.value.crop, Math.exp(-delta * 0.0015), bounds.value, insideFrame({ x: event.clientX, y: event.clientY })))
}

/* ── Keyboard ──────────────────────────────────────────────────── */

function onKeydown(event: KeyboardEvent) {
  const crop = state.value?.crop
  if (!crop || event.metaKey || event.ctrlKey || event.altKey) return
  const arrows: Record<string, [number, number]> = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
  }
  const arrow = arrows[event.key]
  if (arrow) {
    const dx = arrow[0] * Math.max(1, crop.width * 0.02)
    const dy = arrow[1] * Math.max(1, crop.height * 0.02)
    setCrop(
      event.shiftKey
        ? resizeCrop(crop, 'se', dx, dy, bounds.value, ratio.value)
        : moveCrop(crop, dx, dy, bounds.value),
    )
  } else if (event.key === '+' || event.key === '=') setCrop(zoomCrop(crop, 1.1, bounds.value))
  else if (event.key === '-' || event.key === '_') setCrop(zoomCrop(crop, 1 / 1.1, bounds.value))
  else return
  event.preventDefault()
}

/* ── Export and the weight it will have ────────────────────────── */

const estimate = shallowRef<{ key: string; result: EditedFile }>()
const calculating = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let running: AbortController | undefined

const key = computed(() => (state.value ? JSON.stringify([state.value, output.value]) : ''))

function stopEstimate() {
  clearTimeout(timer)
  running?.abort()
  running = undefined
  calculating.value = false
}

async function render(signal?: AbortSignal): Promise<EditedFile> {
  if (!picture.value || !natural.value || !state.value) throw new Error('There is no picture to export')
  const asked = key.value
  if (estimate.value?.key === asked) return estimate.value.result
  const result = await exportEdit(picture.value.file, natural.value, state.value, output.value, signal)
  if (asked === key.value) estimate.value = { key: asked, result }
  return result
}

// The weight shown is the real one: the picture is written each time the editing pauses.
watch([key, interacting], () => {
  stopEstimate()
  if (!key.value || interacting.value || estimate.value?.key === key.value) return
  calculating.value = true
  timer = setTimeout(async () => {
    const controller = (running = new AbortController())
    try {
      await render(controller.signal)
    } catch (error) {
      if (!controller.signal.aborted) emit('error', error)
    }
    if (running === controller) calculating.value = false
  }, 300)
})

/** The picture as it stands, written within the output settings. */
async function exportFile(): Promise<File> {
  return (await render()).file
}

const current = computed(() => (estimate.value?.key === key.value ? estimate.value.result : undefined))
const dimensions = computed(() => {
  if (current.value) return `${current.value.width} × ${current.value.height} px`
  if (!state.value) return ''
  const crop = pixelCrop(state.value.crop, bounds.value)
  return `${crop.width} × ${crop.height} px`
})
const overLimit = computed(
  () => !!current.value && props.maxSize !== undefined && current.value.file.size > props.maxSize,
)

/* ── Lifetime ──────────────────────────────────────────────────── */

let observer: ResizeObserver | undefined

onMounted(() => {
  try {
    writesWebp.value = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    // No canvas: WebP is simply not offered.
  }
  measure()
  if (typeof ResizeObserver !== 'undefined' && stage.value) {
    observer = new ResizeObserver(measure)
    observer.observe(stage.value)
  }
  open()
})
onBeforeUnmount(() => {
  opening++
  stopEstimate()
  clearTimeout(settleTimer)
  observer?.disconnect()
  releasePicture()
})

defineExpose({
  export: exportFile,
  reset,
  rotate,
  flip,
  /** True once the user has changed something. */
  dirty: touched,
  /** True once the picture is open. */
  ready: computed(() => !!state.value),
})
</script>

<template>
  <div :class="cn('flex w-full flex-col gap-3', props.class)" data-slot="image-editor">
    <div
      ref="stage"
      :class="imageEditorStageTheme"
      data-slot="image-editor-stage"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerEnd"
      @pointercancel="onPointerEnd"
      @wheel.prevent="onWheel"
      @dragstart.prevent
    >
      <div v-if="picture && !failed" class="absolute" :class="settling && SETTLE" :style="pictureStyle">
        <img
          :src="picture.url"
          alt=""
          draggable="false"
          class="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
          :class="settling && SETTLE"
          :style="imageStyle"
          @load="onImageLoad"
          @error="onImageError"
        />
      </div>

      <div
        v-if="state"
        ref="frame"
        tabindex="0"
        role="group"
        :aria-label="ousiText.cropArea"
        :aria-describedby="hintId"
        :class="cn(imageEditorFrameTheme({ shape }), settling && SETTLE)"
        :style="frameStyle"
        data-slot="image-editor-frame"
        @keydown="onKeydown"
      >
        <!-- Thirds, to level and centre while moving. -->
        <div v-show="interacting" class="pointer-events-none absolute inset-0 overflow-hidden" :class="shape === 'circle' && 'rounded-full'" aria-hidden="true">
          <span class="absolute inset-y-0 left-1/3 w-px bg-white/50" />
          <span class="absolute inset-y-0 left-2/3 w-px bg-white/50" />
          <span class="absolute inset-x-0 top-1/3 h-px bg-white/50" />
          <span class="absolute inset-x-0 top-2/3 h-px bg-white/50" />
        </div>
        <span v-for="handle in HANDLES" :key="handle" :data-handle="handle" :class="imageEditorHandleTheme({ handle })" aria-hidden="true">
          <span :class="imageEditorMarkTheme({ handle })" />
        </span>
      </div>

      <p v-if="failed" role="alert" class="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-ousi-muted">
        {{ ousiText.cannotOpenImage }}
      </p>
      <span :id="hintId" class="sr-only">{{ ousiText.cropHint }}</span>
    </div>

    <div v-if="fixedRatio === undefined && ratios.length > 1" role="group" :aria-label="ousiText.aspectRatio" class="flex flex-wrap items-center justify-center gap-1" data-slot="image-editor-ratios">
      <OButton
        v-for="option in ratios"
        :key="option.label"
        size="xs"
        :variant="chosenRatio === option.value ? 'soft' : 'text'"
        :aria-pressed="chosenRatio === option.value"
        :disabled="!state"
        @click="selectRatio(option.value)"
      >
        {{ option.label }}
      </OButton>
    </div>

    <div class="flex flex-wrap items-center gap-1" data-slot="image-editor-tools">
      <OButton is-icon-only variant="text" size="sm" :disabled="!state" :aria-label="ousiText.rotateLeft" :title="ousiText.rotateLeft" data-tool="rotate-left" @click="rotate(false)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
      </OButton>
      <OButton is-icon-only variant="text" size="sm" :disabled="!state" :aria-label="ousiText.rotateRight" :title="ousiText.rotateRight" data-tool="rotate-right" @click="rotate(true)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
      </OButton>
      <OButton is-icon-only variant="text" size="sm" :disabled="!state" :aria-label="ousiText.flipHorizontal" :title="ousiText.flipHorizontal" data-tool="flip-horizontal" @click="flip('horizontal')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><path d="M12 3v18" stroke-dasharray="2 3" /><path d="M8 7 3 17h5zM16 7l5 10h-5z" /></svg>
      </OButton>
      <OButton is-icon-only variant="text" size="sm" :disabled="!state" :aria-label="ousiText.flipVertical" :title="ousiText.flipVertical" data-tool="flip-vertical" @click="flip('vertical')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><path d="M3 12h18" stroke-dasharray="2 3" /><path d="M7 8l10-5v5zM7 16l10 5v-5z" /></svg>
      </OButton>

      <div class="flex min-w-40 flex-1 items-center gap-4 px-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" class="size-4 shrink-0 text-ousi-muted" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M8 11h6" /></svg>
        <OSlider
          :model-value="zoom"
          :min="1"
          :max="Math.max(maxZoom, 1.01)"
          :step="0.01"
          :label="ousiText.zoom"
          size="sm"
          :disabled="!state || maxZoom <= 1"
          class="flex-1 gap-0 [&>label]:sr-only"
          @update:model-value="onZoom"
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" class="size-4 shrink-0 text-ousi-muted" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M8 11h6M11 8v6" /></svg>
      </div>

      <OButton variant="text" size="sm" :disabled="!touched" data-tool="reset" @click="reset">
        {{ ousiText.resetEdit }}
      </OButton>
    </div>

    <div v-if="!hideOutputSettings" class="grid items-end gap-3 sm:grid-cols-3" data-slot="image-editor-settings">
      <OSelect
        :model-value="sizeChoice"
        :options="sizeOptions"
        :label="ousiText.maxSide"
        :disabled="!state"
        size="sm"
        variant="secondary"
        @update:model-value="(value) => change(() => (sizeChoice = value as string | number))"
      />
      <OSelect
        :model-value="formatChoice"
        :options="formatOptions"
        :label="ousiText.outputFormat"
        :disabled="!state"
        size="sm"
        variant="secondary"
        @update:model-value="(value) => change(() => (formatChoice = value as string))"
      />
      <OSlider
        :model-value="qualityChoice"
        :min="50"
        :max="100"
        :step="1"
        :label="ousiText.quality"
        show-output
        size="sm"
        :disabled="!state || output.type === 'image/png'"
        class="pb-2"
        @update:model-value="(value) => change(() => (qualityChoice = value as number))"
      />
    </div>

    <div class="flex min-h-4 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs tabular-nums text-ousi-muted">
      <span data-slot="image-editor-dimensions">{{ dimensions }}</span>
      <span v-if="state && picture" aria-live="polite" :class="overLimit && 'text-ousi-danger'" data-slot="image-editor-weight">
        <template v-if="current">
          {{ formatSize(picture.file.size) }} → <strong class="font-medium" :class="!overLimit && 'text-ousi-foreground'">{{ formatSize(current.file.size) }}</strong>
          <template v-if="overLimit"> · {{ fill(ousiText.stillOverLimit, { size: formatSize(maxSize!) }) }}</template>
        </template>
        <template v-else-if="calculating">{{ ousiText.calculating }}</template>
      </span>
    </div>
  </div>
</template>
