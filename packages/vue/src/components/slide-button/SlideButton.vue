<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, shallowRef, toRef, useId, watch } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { useHaptics } from '@ousi-ui/haptics'
import { useOusiMessages } from '../../config'
import { slideButtonFillTheme, slideButtonTheme, slideButtonThumbTheme } from './slide-button.theme'
import type { SlideButtonEmits, SlideButtonProps, SlideButtonSlots } from './slide-button.types'

const props = withDefaults(defineProps<SlideButtonProps>(), {
  // Absent is not false: without this, Vue would make it a controlled button that can never be on.
  modelValue: undefined,
  label: undefined,
  confirmedLabel: undefined,
  loadingLabel: undefined,
  variant: 'primary',
  size: 'md',
  threshold: 0.9,
  loading: false,
  disabled: false,
  fullWidth: false,
  shadow: 'none',
  haptic: 'none',
})
const emit = defineEmits<SlideButtonEmits>()
const slots = defineSlots<SlideButtonSlots>()

const text = useOusiMessages()
const haptics = useHaptics()

const confirmed = useControllableState<boolean>({
  prop: toRef(props, 'modelValue') as never,
  defaultValue: false,
  onChange: (value) => emit('update:modelValue', value),
})

/** From 0, at the start, to 1, at the end. */
const dragged = ref(0)
const dragging = ref(false)
const progress = computed(() => (confirmed.value ? 1 : dragged.value))

const isLocked = computed(() => props.disabled || props.loading || !!confirmed.value)
const enough = computed(() => Math.min(Math.max(props.threshold, 0.5), 1))

function confirm() {
  if (isLocked.value) return
  confirmed.value = true
  // Where the thumb goes now depends on `confirmed` alone. If the app does not take it, the thumb
  // goes back to the start instead of staying where it was let go.
  dragged.value = 0
  if (props.haptic !== 'none') haptics.trigger(props.haptic)
  emit('confirm')
}

function reset() {
  dragged.value = 0
  if (confirmed.value) confirmed.value = false
}

/* ── Dragging the thumb ────────────────────────────────────────── */

const track = ref<HTMLElement | null>(null)
const thumb = ref<HTMLElement | null>(null)
let drag: { pointer: number; from: number; at: number; travel: number; way: 1 | -1 } | undefined

const isRtl = () => !!track.value && getComputedStyle(track.value).direction === 'rtl'

function onPointerdown(event: PointerEvent) {
  if (isLocked.value || event.button > 0 || drag) return
  const box = track.value!
  const knob = thumb.value!
  // The room the thumb has to run: the inside of the track, less itself and the space on each side.
  const travel = box.clientWidth - knob.offsetWidth - 2 * (knob.offsetTop || 0)
  drag = { pointer: event.pointerId, from: event.clientX, at: dragged.value, travel, way: isRtl() ? -1 : 1 }
  dragging.value = true
  knob.setPointerCapture?.(event.pointerId)
  // No text selection, and no focus either: focused from script, the thumb would keep a keyboard
  // ring on it after a drag with the mouse.
  event.preventDefault()
}

function onPointermove(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.pointer || drag.travel <= 0) return
  const by = ((event.clientX - drag.from) * drag.way) / drag.travel
  dragged.value = Math.min(Math.max(drag.at + by, 0), 1)
}

function endDrag(event: PointerEvent, letGo: boolean) {
  if (!drag || event.pointerId !== drag.pointer) return
  drag = undefined
  dragging.value = false
  if (letGo && dragged.value >= enough.value) confirm()
  else dragged.value = 0
}
watch(
  () => props.disabled || props.loading,
  (off) => {
    if (!off || !drag) return
    drag = undefined
    dragging.value = false
    dragged.value = 0
  },
)

/* ── Keyboard and assistive technology ─────────────────────────── */

const STEP = 0.25
function onKeydown(event: KeyboardEvent) {
  if (isLocked.value) return
  const forward = isRtl() ? 'ArrowLeft' : 'ArrowRight'
  const back = isRtl() ? 'ArrowRight' : 'ArrowLeft'
  let to: number
  if (event.key === forward || event.key === 'ArrowUp') to = dragged.value + STEP
  else if (event.key === back || event.key === 'ArrowDown') to = dragged.value - STEP
  else if (event.key === 'End') to = 1
  else if (event.key === 'Home' || event.key === 'Escape') to = 0
  else return
  event.preventDefault()
  // A held key must not run it to the end: each step is a press of its own.
  if (event.repeat) return
  dragged.value = Math.min(Math.max(to, 0), 1)
  if (dragged.value >= 1) confirm()
}
// Leaving it half way is not meant to be kept for later.
function onBlur() {
  if (!drag) dragged.value = 0
}
// A screen reader cannot drag. It activates what it is on, which arrives as a click made by no
// pointer: `detail` counts the clicks of a mouse or finger, and is 0 here.
function onClick(event: MouseEvent) {
  if (event.detail === 0) confirm()
}

/* ── What is shown, and what is read out ───────────────────────── */

const state = computed(() => (props.loading ? 'loading' : confirmed.value ? 'confirmed' : 'idle'))
const context = computed(() => ({ progress: progress.value, confirmed: !!confirmed.value, loading: props.loading }))

/** The text of each state when no slot draws it. */
const atRestText = computed(() => props.label ?? text.value.slideToConfirm)
const confirmedText = computed(() => props.confirmedLabel ?? text.value.confirmed)

// A slot may draw the text, and then the props know nothing of it. So what is read out is taken
// from what is written on the track, less what the slot marks as decoration.
const labelElement = ref<HTMLElement | null>(null)
const written = shallowRef({ state: '', words: '' })
const writtenAtRest = ref('')

function wordsOf(element: HTMLElement): string {
  const parts: string[] = []
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) parts.push(node.textContent?.trim() ?? '')
    else if (node instanceof Element && node.getAttribute('aria-hidden') !== 'true') node.childNodes.forEach(walk)
  }
  // The track's label is itself hidden from assistive technology: the slider speaks for it.
  element.childNodes.forEach(walk)
  return parts.filter(Boolean).join(' ')
}

function read() {
  if (!labelElement.value) return
  const words = wordsOf(labelElement.value)
  if (written.value.state !== state.value || written.value.words !== words) {
    written.value = { state: state.value, words }
  }
  // Not during a drag: the name of what is being dragged stays put.
  if (state.value === 'idle' && !dragging.value && !dragged.value) writtenAtRest.value = words
}
onMounted(read)
onUpdated(read)

// `label` wins; else what the slot writes before confirming, which stays the name afterwards.
const name = computed(() => props.label ?? ((slots.label && writtenAtRest.value) || text.value.slideToConfirm))
/** What to say once there is something to report: empty before confirming. */
const spoken = computed(() => {
  if (state.value === 'idle') return ''
  // Until the new text is on the track, say nothing rather than the text of the state before.
  if (written.value.state !== state.value) return ''
  if (written.value.words) return written.value.words
  return state.value === 'loading' ? (props.loadingLabel ?? name.value) : confirmedText.value
})
const labelId = useId()

const place = computed(() => ({
  insetInlineStart: `calc(var(--slide-pad) + ${progress.value} * (100% - var(--slide-thumb) - var(--slide-pad) * 2))`,
}))
const reach = computed(() => ({
  width: `calc(var(--slide-thumb) + ${progress.value} * (100% - var(--slide-thumb) - var(--slide-pad) * 2))`,
}))
const moving = computed(() => (dragging.value ? 'none' : undefined))

defineExpose({ reset, focus: () => thumb.value?.focus() })
</script>

<template>
  <div
    ref="track"
    data-slot="slide-button"
    :data-state="loading ? 'loading' : confirmed ? 'confirmed' : dragging ? 'dragging' : 'idle'"
    :class="cn(slideButtonTheme({ size, fullWidth, shadow, disabled }), props.class)"
  >
    <div
      data-part="fill"
      :class="[slideButtonFillTheme({ variant }), 'transition-[width,opacity] duration-300 ease-(--ousi-easing-spring) motion-reduce:transition-none', progress > 0 ? 'opacity-100' : 'opacity-0']"
      :style="{ ...reach, transition: moving }"
    />

    <!-- The label keeps clear of the thumb at either end, and gives way as the thumb comes over it. -->
    <span
      :id="labelId"
      ref="labelElement"
      data-part="label"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 truncate px-[calc(var(--slide-thumb)_+_var(--slide-pad)_*_2)] font-medium text-ousi-default-foreground transition-opacity duration-200"
      :style="{ opacity: confirmed || loading ? 1 : Math.max(1 - progress * 1.6, 0), transition: moving }"
    >
      <slot v-if="state === 'confirmed'" name="confirmed-label" v-bind="context">
        <span class="truncate">{{ confirmedText }}</span>
      </slot>
      <slot v-else-if="state === 'loading'" name="loading-label" v-bind="context">
        <span v-if="loadingLabel !== undefined" class="truncate">{{ loadingLabel }}</span>
        <!-- With nothing of its own to say, loading keeps what was there. -->
        <slot v-else name="label" v-bind="context">
          <span class="truncate">{{ atRestText }}</span>
        </slot>
      </slot>
      <slot v-else name="label" v-bind="context">
        <span class="truncate">{{ atRestText }}</span>
      </slot>
    </span>
    <span class="sr-only" role="status">{{ spoken }}</span>

    <!-- A slider to assistive technology: how far along it is, from 0 to 100. -->
    <div
      ref="thumb"
      data-part="thumb"
      role="slider"
      :tabindex="disabled ? -1 : 0"
      :aria-label="name"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(progress * 100)"
      :aria-valuetext="state === 'idle' ? `${Math.round(progress * 100)}%` : spoken"
      :aria-disabled="isLocked || undefined"
      :aria-busy="loading || undefined"
      :class="[slideButtonThumbTheme({ variant, grab: !isLocked }), 'transition-[inset-inline-start] duration-300 ease-(--ousi-easing-spring) motion-reduce:transition-none']"
      :style="{ ...place, transition: moving }"
      @pointerdown="onPointerdown"
      @pointermove="onPointermove"
      @pointerup="endDrag($event, true)"
      @pointercancel="endDrag($event, false)"
      @keydown="onKeydown"
      @blur="onBlur"
      @click="onClick"
    >
      <slot v-if="state === 'loading'" name="loading-icon" v-bind="context">
        <svg data-part="spinner" class="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" />
          <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </svg>
      </slot>
      <slot v-else-if="state === 'confirmed'" name="confirmed-icon" v-bind="context">
        <svg data-part="check" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </slot>
      <!-- Only the arrow is mirrored from right to left: an icon of the app's may not stand it. -->
      <slot v-else name="icon" v-bind="context">
        <svg data-part="arrow" class="size-5 rtl:-scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
        </svg>
      </slot>
    </div>
  </div>
</template>
