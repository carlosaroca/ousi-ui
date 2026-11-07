<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { cn } from '@ousi-ui/core'
import { activityRingColors, activityRingPalette, activityRingTrackColor } from './activity-rings.theme'
import { useFocus, useRoving } from '../chart-shared'
import type { ActivityRingItem, ActivityRingsProps, ActivityRingsSlots } from './activity-rings.types'

const props = withDefaults(defineProps<ActivityRingsProps>(), {
  size: 180,
  strokeWidth: 8,
  gap: 3,
  interactive: true,
  showStats: false,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [key: string | null]
  /** Pointer enters a ring or its legend item, or it receives keyboard focus. */
  'ring-enter': [ring: ActivityRingItem, event: Event]
  /** Pointer leaves a ring or its legend item, or it loses keyboard focus. */
  'ring-leave': [ring: ActivityRingItem, event: Event]
  /** A ring or its legend item is clicked (or activated with Enter/Space). */
  'ring-click': [ring: ActivityRingItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.rings.length)
defineSlots<ActivityRingsSlots>()

// Rings start empty and fill in on mount for an entrance animation.
const mounted = ref(false)
const motion = ref(true)
onMounted(() => {
  motion.value = props.animated && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!motion.value) {
    mounted.value = true
    return
  }
  requestAnimationFrame(() => requestAnimationFrame(() => { mounted.value = true }))
})

const palette = activityRingColors as Record<string, string>

const items = computed<ActivityRingItem[]>(() =>
  props.rings.map((ring, index) => {
    const max = ring.max && ring.max > 0 ? ring.max : 100
    const progress = Math.min(Math.max(ring.value / max, 0), 1)
    const colorName = ring.color ?? activityRingPalette[index % activityRingPalette.length]
    return {
      key: ring.id ?? ring.label,
      index,
      label: ring.label,
      value: ring.value,
      max,
      progress,
      percent: Math.round(progress * 100),
      color: palette[colorName] ?? colorName,
      valueLabel: ring.valueLabel ?? String(ring.value),
    }
  }),
)

const focusedRing = computed(() => items.value.find((r) => r.key === focused.value) ?? null)
const isDimmed = (key: string) => focused.value != null && focused.value !== key
// Diameter (px) of the free space inside the innermost ring, used to size the center slot.
const holeSize = computed(() => {
  const inner = radiusOf(Math.max(props.rings.length - 1, 0))
  const hole = Math.max(inner - props.strokeWidth / 2 - props.gap, 0)
  return (hole * 2 * props.size) / 100
})
const radiusOf = (i: number) => Math.max(50 - props.strokeWidth / 2 - i * (props.strokeWidth + props.gap), 0)

function setFocus(key: string | null) {
  if (props.interactive) setFocused(key)
}
function enter(ring: ActivityRingItem, e: Event) {
  if (!props.interactive) return
  setFocus(ring.key)
  emit('ring-enter', ring, e)
}
function leave(ring: ActivityRingItem, e: Event) {
  if (!props.interactive) return
  setFocus(null)
  emit('ring-leave', ring, e)
}
function click(ring: ActivityRingItem, e: Event) {
  if (props.interactive) emit('ring-click', ring, e)
}

const ariaLabel = computed(
  () => props.label ?? items.value.map((r) => `${r.label} ${r.percent}%`).join(', '),
)
</script>

<template>
  <div data-roving-root :class="cn('inline-flex flex-col items-center gap-5', props.class)">
    <div
      class="relative shrink-0"
      role="img"
      :aria-label="ariaLabel"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <svg viewBox="0 0 100 100" class="size-full -rotate-90" fill="none" aria-hidden="true">
        <g
          v-for="ring in items"
          :key="ring.key"
          :class="interactive && 'cursor-pointer'"
          :style="{
            opacity: isDimmed(ring.key) ? 0.25 : 1,
            transition: 'opacity 200ms ease-out',
          }"
          @mouseenter="enter(ring, $event)"
          @mouseleave="leave(ring, $event)"
          @click="click(ring, $event)"
        >
          <circle
            cx="50" cy="50" :r="radiusOf(ring.index)"
            :stroke="activityRingTrackColor"
            :stroke-width="strokeWidth"
            fill="none"
          />
          <circle
            cx="50" cy="50" :r="radiusOf(ring.index)"
            :stroke="ring.color"
            :stroke-width="strokeWidth"
            fill="none"
            stroke-linecap="round"
            pathLength="100"
            stroke-dasharray="100"
            :stroke-dashoffset="100 - (mounted ? ring.progress : 0) * 100"
            :style="motion ? { transition: `stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1) ${ring.index * 120}ms` } : {}"
          />
        </g>
      </svg>

      <div
        v-if="$slots.default"
        class="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        :style="{ width: `${holeSize}px`, height: `${holeSize}px` }"
      >
        <slot :focused-ring="focusedRing" :rings="items" />
      </div>
    </div>

    <slot v-if="$slots.stats" name="stats" :rings="items" :focused-key="focused" :set-focus="setFocus" />

    <ul v-else-if="showStats" class="flex w-full flex-wrap justify-center gap-x-2 gap-y-1">
      <li
        v-for="ring in items"
        :key="ring.key"
        class="min-w-0 rounded-lg px-3 py-2 outline-none transition-[opacity,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-ousi-accent"
        :class="[
          interactive && 'cursor-pointer',
          isDimmed(ring.key) && 'opacity-40',
          focused === ring.key && 'bg-ousi-default',
        ]"
        :tabindex="roving.tabindexFor(ring.index, interactive)" :data-roving="ring.index" @focusin="roving.activate(ring.index)" @keydown="roving.onKeydown($event, ring.index)"
        @mouseenter="enter(ring, $event)"
        @mouseleave="leave(ring, $event)"
        @focus="enter(ring, $event)"
        @blur="leave(ring, $event)"
        @click="click(ring, $event)"
        @keydown.enter.prevent="click(ring, $event)"
        @keydown.space.prevent="click(ring, $event)"
      >
        <slot name="stat" :ring="ring" :index="ring.index" :focused="focused === ring.key" :dimmed="isDimmed(ring.key)">
          <div class="flex flex-col gap-0.5">
            <span class="flex items-center gap-1.5 whitespace-nowrap text-xs text-ousi-muted">
              <span class="inline-block size-2 shrink-0 rounded-full" :style="{ backgroundColor: ring.color }" />
              {{ ring.label }}
            </span>
            <span class="whitespace-nowrap text-sm font-semibold tabular-nums text-ousi-foreground">
              {{ ring.valueLabel }}
            </span>
          </div>
        </slot>
      </li>
    </ul>
  </div>
</template>
