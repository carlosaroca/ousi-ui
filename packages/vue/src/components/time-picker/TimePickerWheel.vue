<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useHaptics } from '@ousi-ui/haptics'
import { timePickerWheelTheme, timePickerWheelItemTheme } from './time-picker.theme'

interface WheelItem {
  value: number | string
  label: string
}

const props = withDefaults(
  defineProps<{
    items: WheelItem[]
    modelValue: number | string
    /** Accessible label (e.g. "Hour"). */
    label: string
    /** Loop endlessly. Disable for very small lists (e.g. AM/PM). */
    infinite?: boolean
    /** Predicate to mark an item as disabled (out of min/max range). */
    isDisabled?: (value: number | string) => boolean
  }>(),
  { infinite: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: number | string]
}>()

const ITEM_HEIGHT = 40 // must match h-10 in theme
const VISIBLE_ROWS = 5
const SPACER_HEIGHT = ((VISIBLE_ROWS - 1) / 2) * ITEM_HEIGHT // 80px — 2 rows above + below the center
const TILT_DEG_PER_SLOT = 22 // degrees per slot away from center — drum-like 3D feel

const containerRef = ref<HTMLElement | null>(null)
const scrollY = ref(0)
const isDragging = ref(false)

const { trigger: triggerHaptic } = useHaptics()

// ── Display items: triple the array when infinite, single copy otherwise ──
const displayItems = computed(() =>
  props.infinite ? [...props.items, ...props.items, ...props.items] : props.items,
)

function realIdxToDisplay(realIdx: number): number {
  return props.infinite ? props.items.length + realIdx : realIdx
}

function displayIdxToReal(displayIdx: number): number {
  if (!props.infinite) return displayIdx
  const N = props.items.length
  return ((displayIdx % N) + N) % N
}

function isItemDisabled(displayIdx: number): boolean {
  const realIdx = displayIdxToReal(displayIdx)
  const item = props.items[realIdx]
  if (!item) return false
  return props.isDisabled?.(item.value) ?? false
}

// ── Center index (float) — drives 3D tilt + scale + opacity per item ──
const centerIdxFloat = computed(() => scrollY.value / ITEM_HEIGHT)

function itemStyle(idx: number) {
  const signedDistance = idx - centerIdxFloat.value
  const absDistance = Math.abs(signedDistance)
  // 3D tilt: items above tilt their top edge back, items below tilt bottom back.
  const tilt = -signedDistance * TILT_DEG_PER_SLOT
  // Scale narrows with distance — adds foreshortening
  const scale = Math.max(0.78, 1 - absDistance * 0.11)
  // Opacity reinforces the fade for items at the edges
  const opacity = Math.max(0.3, 1 - absDistance * 0.32)
  return {
    transform: `rotateX(${tilt}deg) scale(${scale})`,
    opacity,
  }
}

// ── Selection bookkeeping ──
let lastRealIdx = -1
let isRebalancing = false
let scrollIdleTimer: ReturnType<typeof setTimeout> | null = null
let dragSuppressClick = false

function indexOfValue(val: number | string): number {
  return props.items.findIndex((i) => i.value === val)
}

function scrollToDisplayIdx(displayIdx: number, smooth = true) {
  const el = containerRef.value
  if (!el) return
  const target = displayIdx * ITEM_HEIGHT
  if (smooth) {
    el.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    isRebalancing = true
    el.scrollTop = target
    requestAnimationFrame(() => (isRebalancing = false))
  }
}

function rebalanceIfNeeded() {
  if (!props.infinite) return
  const N = props.items.length
  const ci = centerIdxFloat.value
  if (ci < 0.5 * N) scrollToDisplayIdx(Math.round(ci) + N, false)
  else if (ci > 2.5 * N) scrollToDisplayIdx(Math.round(ci) - N, false)
}

/** When the wheel idles on a disabled item, snap to the nearest enabled one. */
function snapToNearestEnabled() {
  if (!props.isDisabled) return
  const centerDisplayIdx = Math.round(centerIdxFloat.value)
  const realIdx = displayIdxToReal(centerDisplayIdx)
  const item = props.items[realIdx]
  if (!item || !props.isDisabled(item.value)) return

  // Search outward — closest item that's enabled.
  const N = props.items.length
  let bestRealIdx = -1
  for (let offset = 1; offset < N; offset++) {
    const upIdx = ((realIdx - offset) % N + N) % N
    const downIdx = (realIdx + offset) % N
    if (!props.isDisabled(props.items[upIdx].value)) { bestRealIdx = upIdx; break }
    if (!props.isDisabled(props.items[downIdx].value)) { bestRealIdx = downIdx; break }
  }
  if (bestRealIdx < 0) return

  // Find nearest displayIdx for the enabled real index — minimize scroll distance.
  let bestDisplayIdx = realIdxToDisplay(bestRealIdx)
  if (props.infinite) {
    const candidates = [bestRealIdx, bestRealIdx + N, bestRealIdx + 2 * N]
    bestDisplayIdx = candidates.reduce((best, c) =>
      Math.abs(c - centerDisplayIdx) < Math.abs(best - centerDisplayIdx) ? c : best,
    candidates[0])
  }
  scrollToDisplayIdx(bestDisplayIdx)
  emit('update:modelValue', props.items[bestRealIdx].value)
  lastRealIdx = bestRealIdx
}

function handleScroll() {
  if (!containerRef.value) return
  if (isRebalancing) return

  scrollY.value = containerRef.value.scrollTop

  const centerIdx = Math.round(centerIdxFloat.value)
  const realIdx = displayIdxToReal(centerIdx)
  if (realIdx !== lastRealIdx && realIdx >= 0 && realIdx < props.items.length) {
    const item = props.items[realIdx]
    // Don't emit while centered on a disabled item — scroll-end handler will redirect.
    if (item && !(props.isDisabled?.(item.value) ?? false)) {
      lastRealIdx = realIdx
      triggerHaptic('selection')
      if (item.value !== props.modelValue) emit('update:modelValue', item.value)
    }
  }

  if (scrollIdleTimer) clearTimeout(scrollIdleTimer)
  scrollIdleTimer = setTimeout(() => {
    rebalanceIfNeeded()
    snapToNearestEnabled()
  }, 180)
}

function handleItemClick(displayIdx: number) {
  if (dragSuppressClick) return
  if (isItemDisabled(displayIdx)) return
  scrollToDisplayIdx(displayIdx)
  const realIdx = displayIdxToReal(displayIdx)
  const item = props.items[realIdx]
  if (item && item.value !== props.modelValue) emit('update:modelValue', item.value)
}

function handleKeydown(e: KeyboardEvent) {
  const cur = indexOfValue(props.modelValue)
  if (cur < 0) return
  const N = props.items.length
  const findNext = (start: number, dir: 1 | -1): number | null => {
    for (let step = 1; step <= N; step++) {
      const candidate = props.infinite
        ? ((start + dir * step) % N + N) % N
        : Math.min(N - 1, Math.max(0, start + dir * step))
      const item = props.items[candidate]
      if (!props.isDisabled?.(item.value)) return candidate
      if (!props.infinite && (candidate === 0 || candidate === N - 1)) return null
    }
    return null
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const next = findNext(cur, 1)
    if (next !== null) {
      scrollToDisplayIdx(realIdxToDisplay(next))
      emit('update:modelValue', props.items[next].value)
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    const prev = findNext(cur, -1)
    if (prev !== null) {
      scrollToDisplayIdx(realIdxToDisplay(prev))
      emit('update:modelValue', props.items[prev].value)
    }
  } else if (e.key === 'Home') {
    e.preventDefault()
    const first = props.items.findIndex((i) => !props.isDisabled?.(i.value))
    if (first >= 0) {
      scrollToDisplayIdx(realIdxToDisplay(first))
      emit('update:modelValue', props.items[first].value)
    }
  } else if (e.key === 'End') {
    e.preventDefault()
    let last = -1
    for (let i = props.items.length - 1; i >= 0; i--) {
      if (!props.isDisabled?.(props.items[i].value)) { last = i; break }
    }
    if (last >= 0) {
      scrollToDisplayIdx(realIdxToDisplay(last))
      emit('update:modelValue', props.items[last].value)
    }
  }
}

// ── Drag-with-mouse — touch falls back to native scroll w/ momentum ──
let dragStartY = 0
let dragStartScroll = 0
let dragMovedPx = 0
let activePointerId: number | null = null

function handlePointerDown(e: PointerEvent) {
  // Only intercept mouse — touch and pen use native scroll for momentum/inertia.
  if (e.pointerType !== 'mouse') return
  if (e.button !== 0) return
  const el = containerRef.value
  if (!el) return
  isDragging.value = true
  activePointerId = e.pointerId
  dragStartY = e.clientY
  dragStartScroll = el.scrollTop
  dragMovedPx = 0
  dragSuppressClick = false
  el.setPointerCapture(e.pointerId)
}

function handlePointerMove(e: PointerEvent) {
  if (!isDragging.value || activePointerId !== e.pointerId) return
  const el = containerRef.value
  if (!el) return
  const dy = e.clientY - dragStartY
  dragMovedPx = Math.abs(dy)
  el.scrollTop = dragStartScroll - dy
  if (dragMovedPx > 4) dragSuppressClick = true
}

function handlePointerUp(e: PointerEvent) {
  if (!isDragging.value || activePointerId !== e.pointerId) return
  isDragging.value = false
  activePointerId = null
  const el = containerRef.value
  if (el) {
    try { el.releasePointerCapture(e.pointerId) } catch {}
    const nearestIdx = Math.round(el.scrollTop / ITEM_HEIGHT)
    scrollToDisplayIdx(nearestIdx)
  }
  setTimeout(() => (dragSuppressClick = false), 0)
}

// ── Sync external value → scroll position ──
watch(
  () => props.modelValue,
  (v) => {
    if (isDragging.value) return
    const realIdx = indexOfValue(v)
    if (realIdx < 0) return
    const el = containerRef.value
    if (!el) return
    const targetDisplayIdx = realIdxToDisplay(realIdx)
    const currentDisplayIdx = Math.round(el.scrollTop / ITEM_HEIGHT)
    if (props.infinite) {
      const currentReal = displayIdxToReal(currentDisplayIdx)
      if (currentReal === realIdx) return
    } else if (currentDisplayIdx === targetDisplayIdx) return
    scrollToDisplayIdx(targetDisplayIdx)
    lastRealIdx = realIdx
  },
)

onMounted(() => {
  nextTick(() => {
    const realIdx = Math.max(0, indexOfValue(props.modelValue))
    scrollToDisplayIdx(realIdxToDisplay(realIdx), false)
    lastRealIdx = realIdx
  })
})

onBeforeUnmount(() => {
  if (scrollIdleTimer) clearTimeout(scrollIdleTimer)
})
</script>

<template>
  <div class="ousi-tp-wheel-outer relative">
    <div
      ref="containerRef"
      :class="timePickerWheelTheme"
      :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
      role="listbox"
      :aria-label="label"
      tabindex="0"
      @scroll="handleScroll"
      @keydown="handleKeydown"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
    >
      <div :style="{ height: `${SPACER_HEIGHT}px` }" aria-hidden="true" />
      <div
        v-for="(item, i) in displayItems"
        :key="i"
        :class="[timePickerWheelItemTheme(), isItemDisabled(i) ? 'pointer-events-none !opacity-30 line-through' : '']"
        :style="itemStyle(i)"
        role="option"
        :aria-selected="i === Math.round(centerIdxFloat) ? true : undefined"
        :aria-disabled="isItemDisabled(i) || undefined"
        @click="handleItemClick(i)"
      >
        {{ item.label }}
      </div>
      <div :style="{ height: `${SPACER_HEIGHT}px` }" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.ousi-tp-wheel-outer {
  /* Fade mask — items at top/bottom edges fade into the popover background. */
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 22%,
    black 78%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 22%,
    black 78%,
    transparent 100%
  );
  /* 3D perspective so per-item rotateX renders as drum tilt instead of a flat skew. */
  perspective: 800px;
  perspective-origin: center center;
}

@media (prefers-reduced-motion: reduce) {
  /* Disable 3D + scale; keep base text + fade mask only. */
  .ousi-tp-wheel-outer [role="option"] {
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
