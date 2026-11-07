<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { resolveChartColor, useChartMotion, useFocus } from '../chart-shared'
import type { GaugeItem, SegmentedGaugeProps, SegmentedGaugeSlots } from './segmented-gauge.types'

const props = withDefaults(defineProps<SegmentedGaugeProps>(), {
  size: 200,
  strokeWidth: 10,
  sweep: 270,
  gap: 8,
  interactive: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [index: number | null]
  'segment-enter': [item: GaugeItem, event: Event]
  'segment-leave': [item: GaugeItem, event: Event]
  'segment-click': [item: GaugeItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
defineSlots<SegmentedGaugeSlots>()

const { mounted, motion } = useChartMotion(() => props.animated)

const R = computed(() => 50 - props.strokeWidth / 2 - 1)
const fullRing = computed(() => props.sweep >= 360)

const items = computed<GaugeItem[]>(() =>
  props.segments.map((s, index) => ({
    key: s.id ?? s.label,
    index,
    label: s.label,
    value: s.value,
    max: s.max,
    percent: Math.round((Math.min(Math.max(s.value / (s.max || 1), 0), 1)) * 100),
    color: resolveChartColor(s.color, index),
    valueLabel: s.valueLabel ?? String(s.value),
  })),
)

const total = computed(() => props.segments.reduce((t, s) => t + s.value, 0))
const maxTotal = computed(() => props.segments.reduce((t, s) => t + s.max, 0))

// Angles are in degrees, 0° at 3 o'clock, clockwise (SVG). The gauge opens at the bottom.
const start = computed(() => (fullRing.value ? -90 : 90 + (360 - props.sweep) / 2))
const arcs = computed(() => {
  const n = Math.max(items.value.length, 1)
  const usable = props.sweep - props.gap * (fullRing.value ? n : n - 1)
  let cursor = start.value
  return items.value.map((it) => {
    const span = Math.max((usable * it.max) / (maxTotal.value || 1), 0)
    const a0 = cursor
    cursor += span + props.gap
    return { a0, a1: a0 + span, span }
  })
})

const point = (deg: number): [number, number] => {
  const rad = (deg * Math.PI) / 180
  return [50 + Math.cos(rad) * R.value, 50 + Math.sin(rad) * R.value]
}
function arcPath(a0: number, a1: number) {
  if (a1 - a0 <= 0.01) return ''
  const [x0, y0] = point(a0)
  const [x1, y1] = point(a1)
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${x0},${y0}A${R.value},${R.value} 0 ${large} 1 ${x1},${y1}`
}

const focusedSegment = computed(() => (focused.value == null ? null : items.value[focused.value] ?? null))
const isDimmed = (i: number) => focused.value != null && focused.value !== i

function enter(it: GaugeItem, e: Event) {
  if (!props.interactive) return
  setFocused(it.index)
  emit('segment-enter', it, e)
}
function leave(it: GaugeItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('segment-leave', it, e)
}
function click(it: GaugeItem, e: Event) {
  if (props.interactive) emit('segment-click', it, e)
}

const ariaLabel = computed(() => props.label ?? items.value.map((i) => `${i.label} ${i.value} of ${i.max}`).join(', '))
</script>

<template>
  <div
    :class="cn('relative inline-block max-w-full align-top', props.class)"
    role="img"
    :aria-label="ariaLabel"
  >
    <svg :width="size" :height="size" viewBox="0 0 100 100" class="block h-auto max-w-full" fill="none" aria-hidden="true">
      <g
        v-for="it in items"
        :key="it.key"
        :class="interactive && 'cursor-pointer'"
        :style="{ opacity: isDimmed(it.index) ? 0.3 : 1, transition: 'opacity 200ms ease-out' }"
        @mouseenter="enter(it, $event)"
        @mouseleave="leave(it, $event)"
        @click="click(it, $event)"
      >
        <path
          :d="arcPath(arcs[it.index].a0, arcs[it.index].a1)"
          :stroke-width="strokeWidth" stroke-linecap="round"
          stroke="var(--ousi-default)"
        />
        <path
          v-if="it.percent > 0"
          :d="arcPath(arcs[it.index].a0, arcs[it.index].a1)"
          :stroke="it.color" :stroke-width="strokeWidth" stroke-linecap="round"
          pathLength="1" stroke-dasharray="1"
          :stroke-dashoffset="1 - (mounted ? it.value / (it.max || 1) : 0)"
          :style="{ transition: motion ? `stroke-dashoffset 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${it.index * 150}ms` : 'none' }"
        />
      </g>
    </svg>

    <div v-if="$slots.default" class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <slot :total="total" :max="maxTotal" :focused-segment="focusedSegment" />
    </div>
  </div>
</template>
