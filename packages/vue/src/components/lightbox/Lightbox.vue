<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useControllableState, useFocusScope, useLayer, useMounted, useScrollLock } from '@ousi-ui/core'
import { useOusiMessages } from '../../config'
import { clamp } from './lightbox.geometry'
import { lightboxBackdropTheme, lightboxButtonTheme, lightboxThumbnailTheme } from './lightbox.theme'
import { useLightboxGestures } from './use-lightbox-gestures'
import type { LightboxEmits, LightboxImage, LightboxProps, LightboxSlotContext, LightboxSlots } from './lightbox.types'

const props = withDefaults(defineProps<LightboxProps>(), {
  // Absent is not false: uncontrolled, the trigger and open() hold the state.
  modelValue: undefined,
  index: undefined,
  loop: false,
  thumbnails: true,
  showCounter: true,
  zoomable: true,
  maxZoom: 4,
  downloadable: false,
  closeOnBackdrop: true,
  swipeToClose: true,
  animated: true,
})
const emit = defineEmits<LightboxEmits>()
defineSlots<LightboxSlots>()

const text = useOusiMessages()
const isMounted = useMounted()

const pictures = computed<LightboxImage[]>(() =>
  props.images.map((image) => (typeof image === 'string' ? { src: image } : image)),
)
const total = computed(() => pictures.value.length)

/* ── Open and which picture ────────────────────────────────────── */

const openValue = useControllableState<boolean>({
  prop: toRef(props, 'modelValue') as never,
  defaultValue: false,
  onChange: (value) => emit('update:modelValue', value),
})
const isOpen = computed(() => !!openValue.value && total.value > 0)

const indexValue = useControllableState<number>({
  prop: toRef(props, 'index') as never,
  defaultValue: 0,
  onChange: (value) => emit('update:index', value),
})
const current = computed(() => clamp(indexValue.value, 0, Math.max(total.value - 1, 0)))
const picture = computed(() => pictures.value[current.value])

function open(at?: number) {
  if (at !== undefined) goTo(at)
  if (!openValue.value) openValue.value = true
}
function close() {
  if (!openValue.value) return
  openValue.value = false
  emit('close')
}
// With nothing left to show, as after deleting the last picture, it closes.
watch(total, (count) => count === 0 && close())

/** Which side the new picture comes in from. */
let from = 1
function goTo(index: number) {
  const to = clamp(index, 0, Math.max(total.value - 1, 0))
  if (to === current.value) return
  from = to > current.value ? 1 : -1
  indexValue.value = to
}
const canGo = (way: 1 | -1) =>
  total.value > 1 && (props.loop || (way === 1 ? current.value < total.value - 1 : current.value > 0))
function go(way: 1 | -1) {
  if (!canGo(way)) return
  from = way
  indexValue.value = (current.value + way + total.value) % total.value
}
const next = () => go(1)
const previous = () => go(-1)

/* ── Gestures ──────────────────────────────────────────────────── */

const dialog = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
const frame = ref<HTMLElement | null>(null)

const isRtl = () => !!dialog.value && getComputedStyle(dialog.value).direction === 'rtl'

const gestures = useLightboxGestures({
  stage: () => stage.value,
  // A picture still loading, or that failed, cannot be zoomed or tapped.
  picture: () => (status.value === 'ready' ? image.value : null),
  zoomable: () => props.zoomable && status.value === 'ready',
  maxZoom: () => props.maxZoom,
  canGo,
  many: () => total.value > 1,
  rtl: isRtl,
  onGo: go,
  canDismiss: () => props.swipeToClose,
  onDismiss: close,
  onTapOutside: () => props.closeOnBackdrop && close(),
})
const zoom = computed(() => gestures.view.value.scale)
const isZoomed = computed(() => zoom.value > 1)
const ZOOM_STEP = 1.5
const zoomIn = () => gestures.zoomBy(ZOOM_STEP)
const zoomOut = () => gestures.zoomBy(1 / ZOOM_STEP)
const resetZoom = () => gestures.zoomTo(1)

const imageStyle = computed(() => {
  const { x, y, scale } = gestures.view.value
  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    transition: gestures.holding.value ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
  }
})
const frameStyle = computed(() => {
  const { x, y } = gestures.drag.value
  return {
    transform: x || y ? `translate3d(${x}px, ${y}px, 0) scale(${1 - Math.min(y / 1600, 0.15)})` : undefined,
    transition: gestures.holding.value ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
  }
})
/** The page shows through as a picture is dragged away. */
const dim = computed(() => 1 - Math.min(gestures.drag.value.y / 500, 0.7))

/* ── Loading ───────────────────────────────────────────────────── */

const status = ref<'loading' | 'ready' | 'error'>('loading')
const isCurrent = (event: Event) => (event.target as HTMLImageElement).getAttribute('src') === picture.value?.src
function onLoad(event: Event) {
  // The event of a picture already left behind says nothing about this one.
  if (isCurrent(event)) status.value = 'ready'
}
function onError(event: Event) {
  if (!isCurrent(event)) return
  status.value = 'error'
  emit('error', picture.value!, current.value)
}

const motionAllowed = () => props.animated && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Each source on its own, so this runs when the picture is another one and not when the app renders
// the same list again: the element would be kept, would not load a second time, and the viewer
// would wait for it for ever.
watch(
  [isOpen, current, () => picture.value?.src],
  ([openNow], previousState) => {
    gestures.reset()
    status.value = 'loading'
    if (!openNow || !isMounted.value) return
    // The neighbours are fetched ahead, so turning to them does not wait.
    for (const way of [1, -1] as const) {
      if (!canGo(way)) continue
      new Image().src = pictures.value[(current.value + way + total.value) % total.value]!.src
    }
    const turned = previousState?.[0]
    nextTick(() => {
      if (turned && motionAllowed()) {
        frame.value?.animate?.(
          [{ opacity: 0, translate: `${(isRtl() ? -from : from) * 48}px 0` }, { opacity: 1, translate: '0 0' }],
          { duration: 240, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        )
      }
      showThumbnail(!!turned)
    })
  },
  { immediate: true },
)
watch(isMounted, () => isOpen.value && nextTick(() => showThumbnail(false)))

/* ── Thumbnails ────────────────────────────────────────────────── */

const strip = ref<HTMLElement | null>(null)
const hasStrip = computed(() => props.thumbnails && total.value > 1)
function showThumbnail(smooth: boolean) {
  const button = strip.value?.querySelector<HTMLElement>('[aria-current="true"]')
  if (!button) return
  // Focus follows the picture while it is on the strip.
  if (strip.value!.contains(document.activeElement)) button.focus({ preventScroll: true })
  button.scrollIntoView?.({ block: 'nearest', inline: 'center', behavior: smooth && motionAllowed() ? 'smooth' : 'auto' })
}

/* ── Size, keyboard ────────────────────────────────────────────── */

let resize: ResizeObserver | undefined
watch(stage, (el) => {
  resize?.disconnect()
  resize = el && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => gestures.fit()) : undefined
  if (el) resize?.observe(el)
})
onBeforeUnmount(() => resize?.disconnect())

const PAN_STEP = 80
function onKeydown(event: KeyboardEvent) {
  // With Ctrl or Command these keys are the browser's own zoom.
  if (event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return
  if ((event.target as Element).closest('input, textarea, select, [contenteditable]')) return
  const forward = isRtl() ? 'ArrowLeft' : 'ArrowRight'
  const back = isRtl() ? 'ArrowRight' : 'ArrowLeft'

  if (isZoomed.value && event.key.startsWith('Arrow')) {
    // Zoomed in, the arrows look around the picture.
    const move = { ArrowLeft: [PAN_STEP, 0], ArrowRight: [-PAN_STEP, 0], ArrowUp: [0, PAN_STEP], ArrowDown: [0, -PAN_STEP] }
    const by = move[event.key as keyof typeof move]
    gestures.pan(by[0]!, by[1]!)
  } else if (event.key === forward) next()
  else if (event.key === back) previous()
  else if (event.key === 'Home') goTo(0)
  else if (event.key === 'End') goTo(total.value - 1)
  else if (event.key === '+' || event.key === '=') zoomIn()
  else if (event.key === '-') zoomOut()
  else if (event.key === '0') resetZoom()
  else return
  event.preventDefault()
}

/* ── Layer and focus ───────────────────────────────────────────── */

useScrollLock(isOpen)
const root = ref<HTMLElement | null>(null)
const { zIndex } = useLayer(isOpen, { elements: root, modal: true, restoreFocus: false, onEscape: () => close() })
// Focus moves in on open, Tab stays inside, and focus returns to what opened it.
useFocusScope({ containerRef: dialog, enabled: isOpen })

const position = computed(() =>
  text.value.imagePosition.replace('{index}', String(current.value + 1)).replace('{total}', String(total.value)),
)
const announcement = computed(() => [total.value > 1 ? position.value : '', picture.value?.alt].filter(Boolean).join(': '))
const context = computed<LightboxSlotContext>(() => ({
  image: picture.value!,
  index: current.value,
  total: total.value,
  zoom: zoom.value,
  close,
}))

defineExpose({ open, close, next, previous, goTo, zoomIn, zoomOut, resetZoom })
</script>

<template>
  <slot name="trigger" :open="open" />

  <Teleport v-if="isMounted" to="body">
    <AnimatePresence>
      <Motion
        v-if="isOpen"
        tag="div"
        :initial="({ opacity: 0 } as any)"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: animated ? 0.2 : 0 }"
      >
        <div ref="root" data-slot="lightbox" class="fixed inset-0" :style="{ zIndex }">
          <div data-part="backdrop" :class="lightboxBackdropTheme" :style="{ opacity: dim }" aria-hidden="true" />

          <div
            ref="dialog"
            role="dialog"
            aria-modal="true"
            :aria-label="label ?? text.lightbox"
            tabindex="-1"
            :class="cn('absolute inset-0 flex flex-col text-white outline-none', props.class)"
            @keydown="onKeydown"
          >
            <!-- Bar -->
            <div class="flex items-center gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]" :style="{ opacity: dim }">
              <span v-if="showCounter && total > 1" data-part="counter" class="px-1 text-sm tabular-nums text-white/80" aria-hidden="true">{{ position }}</span>
              <div class="ms-auto flex items-center gap-2">
                <slot name="actions" v-bind="context" />
                <template v-if="zoomable">
                  <button type="button" data-part="zoom-out" :class="[lightboxButtonTheme, 'max-sm:hidden']" :aria-label="text.zoomOut" :aria-disabled="!isZoomed || undefined" @click="zoomOut">
                    <slot name="zoom-out-icon" v-bind="context">
                      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8 11h6" /></svg>
                    </slot>
                  </button>
                  <button type="button" data-part="zoom-in" :class="[lightboxButtonTheme, 'max-sm:hidden']" :aria-label="text.zoomIn" :aria-disabled="zoom >= maxZoom || status !== 'ready' || undefined" @click="zoomIn">
                    <slot name="zoom-in-icon" v-bind="context">
                      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8 11h6M11 8v6" /></svg>
                    </slot>
                  </button>
                </template>
                <a v-if="downloadable" data-part="download" :class="lightboxButtonTheme" :href="picture?.src" :download="picture?.downloadName ?? ''" target="_blank" rel="noopener" :aria-label="text.download">
                  <slot name="download-icon" v-bind="context">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
                  </slot>
                </a>
                <button type="button" data-part="close" data-autofocus :class="lightboxButtonTheme" :aria-label="text.lightboxClose" @click="close">
                  <slot name="close-icon" v-bind="context">
                    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </slot>
                </button>
              </div>
            </div>

            <div class="relative min-h-0 flex-1">
              <!-- The stage takes the gestures; the buttons beside it are not part of it. -->
              <div
                ref="stage"
                data-part="stage"
                :class="['absolute inset-0 touch-none select-none overflow-hidden', isZoomed ? 'cursor-grab active:cursor-grabbing' : zoomable && 'cursor-zoom-in']"
                v-on="gestures.handlers"
              >
                <div ref="frame" data-part="frame" class="flex size-full items-center justify-center px-2 sm:px-16" :style="frameStyle">
                  <img
                    v-if="picture && status !== 'error'"
                    :key="`${current}-${picture.src}`"
                    ref="image"
                    data-part="image"
                    :src="picture.src"
                    :alt="picture.alt ?? ''"
                    draggable="false"
                    class="max-h-full max-w-full rounded-ousi-lg object-contain motion-reduce:!transition-none"
                    :class="status === 'ready' ? 'opacity-100' : 'opacity-0'"
                    :style="imageStyle"
                    @load="onLoad"
                    @error="onError"
                  />
                </div>
              </div>

              <div v-if="status === 'loading'" data-part="loading" class="pointer-events-none absolute inset-0 flex items-center justify-center">
                <svg class="size-8 animate-spin" viewBox="0 0 24 24" fill="none" :aria-label="text.loading" role="img"><circle class="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" /><path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>
              </div>
              <div v-else-if="status === 'error'" data-part="failed" class="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/80">
                <div class="pointer-events-auto">
                  <slot name="error" v-bind="context">{{ text.imageFailed }}</slot>
                </div>
              </div>

              <template v-if="total > 1">
                <button type="button" data-part="previous" :class="[lightboxButtonTheme, 'absolute start-3 top-1/2 -translate-y-1/2 max-sm:hidden']" :aria-label="text.previous" :aria-disabled="!canGo(-1) || undefined" @click="previous">
                  <slot name="previous-icon" v-bind="context">
                    <svg class="size-5 rtl:-scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
                  </slot>
                </button>
                <button type="button" data-part="next" :class="[lightboxButtonTheme, 'absolute end-3 top-1/2 -translate-y-1/2 max-sm:hidden']" :aria-label="text.next" :aria-disabled="!canGo(1) || undefined" @click="next">
                  <slot name="next-icon" v-bind="context">
                    <svg class="size-5 rtl:-scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
                  </slot>
                </button>
              </template>
            </div>

            <!-- Caption and thumbnails -->
            <div class="flex flex-col items-center gap-3 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]" :style="{ opacity: dim }">
              <div v-if="$slots.caption || picture?.caption" data-part="caption" class="max-h-24 max-w-2xl overflow-y-auto text-center text-sm text-white/90">
                <slot name="caption" v-bind="context">{{ picture?.caption }}</slot>
              </div>
              <div v-if="hasStrip" ref="strip" data-part="strip" role="group" :aria-label="text.chooseImage" class="flex max-w-full gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  v-for="(thumb, i) in pictures"
                  :key="thumb.id ?? `${thumb.src}-${i}`"
                  type="button"
                  :class="[lightboxThumbnailTheme, i === current ? 'border-white opacity-100' : 'border-transparent opacity-55 hover:opacity-100']"
                  :aria-label="text.showImage.replace('{index}', String(i + 1))"
                  :aria-current="i === current ? 'true' : undefined"
                  :tabindex="i === current ? 0 : -1"
                  @click="goTo(i)"
                >
                  <img :src="thumb.thumbnail ?? thumb.src" alt="" loading="lazy" draggable="false" class="size-full object-cover" />
                </button>
              </div>
            </div>

            <span class="sr-only" role="status">{{ announcement }}</span>
          </div>
        </div>
      </Motion>
    </AnimatePresence>
  </Teleport>
</template>
