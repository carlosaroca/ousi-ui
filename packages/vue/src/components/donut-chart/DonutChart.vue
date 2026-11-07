<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { resolveChartColor, useChartMotion, useFocus, useRoving } from '../chart-shared'
import type { DonutChartProps, DonutChartSlots, DonutItem } from './donut-chart.types'

const props = withDefaults(defineProps<DonutChartProps>(), {
  variant: 'donut',
  size: 220,
  thickness: 16,
  gap: 2,
  rounded: false,
  explode: 3,
  showLegend: false,
  interactive: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [index: number | null]
  'segment-enter': [item: DonutItem, event: Event]
  'segment-leave': [item: DonutItem, event: Event]
  'segment-click': [item: DonutItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.data.length)
defineSlots<DonutChartSlots>()

const { mounted, motion } = useChartMotion(() => props.animated)
const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()

const total = computed(() => props.data.reduce((t, d) => t + Math.max(d.value, 0), 0))

const items = computed<DonutItem[]>(() =>
  props.data.map((d, index) => ({
    key: d.id ?? d.label,
    index,
    label: d.label,
    value: d.value,
    percent: total.value ? Math.round((Math.max(d.value, 0) / total.value) * 1000) / 10 : 0,
    color: resolveChartColor(d.color, index),
    formatted: fmt(d.value),
  })),
)

// Geometry (viewBox 0 0 100 100, 0° at 12 o'clock, clockwise)
const pad = computed(() => props.explode + 1)
const outer = computed(() => 50 - pad.value)
const stroke = computed(() => (props.variant === 'pie' ? outer.value : Math.min(props.thickness, outer.value)))
const R = computed(() => (props.variant === 'pie' ? outer.value / 2 : outer.value - stroke.value / 2))

const arcs = computed(() => {
  const visible = items.value.filter((i) => i.value > 0).length
  const gap = visible > 1 ? props.gap : 0
  const usable = 360 - gap * visible
  let cursor = gap / 2
  const inset = props.rounded ? (stroke.value / 2 / R.value) * (180 / Math.PI) : 0
  return items.value.map((it) => {
    const span = total.value ? (usable * Math.max(it.value, 0)) / total.value : 0
    const mid = cursor + span / 2
    // A segment too short for round caps collapses into a dot centered in its slot
    const short = span - inset * 2 < 0.6
    const a0 = short ? mid - 0.3 : cursor + inset
    const a1 = short ? mid + 0.3 : Math.min(cursor + span - inset, a0 + 359.9)
    cursor += span + gap
    return { a0, a1, mid }
  })
})

const pt = (deg: number, r: number): [number, number] => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [50 + Math.cos(rad) * r, 50 + Math.sin(rad) * r]
}
function arcPath(a0: number, a1: number) {
  const [x0, y0] = pt(a0, R.value)
  const [x1, y1] = pt(a1, R.value)
  return `M${x0},${y0}A${R.value},${R.value} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}`
}
function offset(i: number) {
  if (focused.value !== i) return 'translate(0px, 0px)'
  const [x, y] = pt(arcs.value[i].mid, props.explode)
  return `translate(${x - 50}px, ${y - 50}px)`
}

const focusedItem = computed(() => (focused.value == null ? null : items.value[focused.value] ?? null))
const isDimmed = (i: number) => focused.value != null && focused.value !== i

function enter(it: DonutItem, e: Event) {
  if (!props.interactive) return
  setFocused(it.index)
  emit('segment-enter', it, e)
}
function leave(it: DonutItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('segment-leave', it, e)
}
function click(it: DonutItem, e: Event) {
  if (props.interactive) emit('segment-click', it, e)
}

const holeSize = computed(() => ((R.value - stroke.value / 2) * 2 * props.size) / 100)
const ariaLabel = computed(() => props.label ?? items.value.map((i) => `${i.label} ${i.percent}%`).join(', '))
</script>

<template>
  <div data-roving-root :class="cn('inline-flex flex-col items-center gap-5', props.class)">
    <div class="relative shrink-0" :style="{ width: `${size}px`, height: `${size}px` }" role="img" :aria-label="ariaLabel">
      <svg viewBox="0 0 100 100" class="size-full overflow-visible" fill="none">
        <circle v-if="items.length === 0 || total === 0" cx="50" cy="50" :r="R" stroke="var(--ousi-default)" :stroke-width="stroke" />
        <g
          v-for="(it, i) in items"
          :key="it.key"
          :class="interactive && 'cursor-pointer outline-none'"
          :tabindex="roving.tabindexFor(i, interactive)" :data-roving="i" @focusin="roving.activate(i)" @keydown="roving.onKeydown($event, i)"
          :aria-label="`${it.label}: ${it.formatted}, ${it.percent}%`"
          :style="{
            opacity: isDimmed(i) ? 0.3 : 1,
            transform: offset(i),
            transition: 'opacity 200ms ease-out, transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          }"
          @mouseenter="enter(it, $event)"
          @mouseleave="leave(it, $event)"
          @focus="enter(it, $event)"
          @blur="leave(it, $event)"
          @click="click(it, $event)"
          @keydown.enter.prevent="click(it, $event)"
          @keydown.space.prevent="click(it, $event)"
        >
          <path
            v-if="it.value > 0"
            :d="arcPath(arcs[i].a0, arcs[i].a1)"
            :stroke="it.color"
            :stroke-width="stroke"
            :stroke-linecap="rounded ? 'round' : 'butt'"
            pathLength="1"
            stroke-dasharray="1"
            :stroke-dashoffset="mounted ? 0 : 1"
            :style="{ transition: motion ? `stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 110}ms` : 'none' }"
          />
        </g>
      </svg>

      <div
        v-if="variant === 'donut'"
        class="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center"
        :style="{ width: `${holeSize}px`, height: `${holeSize}px` }"
      >
        <slot :total="total" :formatted-total="fmt(total)" :focused-item="focusedItem">
          <div class="px-2">
            <div class="truncate text-2xl font-semibold tabular-nums text-ousi-foreground">{{ focusedItem ? focusedItem.formatted : fmt(total) }}</div>
            <div class="truncate text-xs text-ousi-muted">{{ focusedItem ? `${focusedItem.label} · ${focusedItem.percent}%` : 'Total' }}</div>
          </div>
        </slot>
      </div>
    </div>

    <ul v-if="showLegend" class="flex w-full flex-col gap-1">
      <li
        v-for="it in items"
        :key="`l-${it.key}`"
        class="flex items-center justify-between gap-4 rounded-lg px-2 py-1 transition-opacity duration-200"
        :class="[interactive && 'cursor-pointer', isDimmed(it.index) && 'opacity-40', focused === it.index && 'bg-ousi-default']"
        @mouseenter="enter(it, $event)"
        @mouseleave="leave(it, $event)"
        @click="click(it, $event)"
      >
        <slot name="legend" :item="it" :focused="focused === it.index" :dimmed="isDimmed(it.index)">
          <span class="flex items-center gap-2 text-sm text-ousi-muted">
            <span class="inline-block size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: it.color }" />{{ it.label }}
          </span>
          <span class="text-sm tabular-nums"><b class="font-semibold text-ousi-foreground">{{ it.formatted }}</b> <span class="text-ousi-muted">{{ it.percent }}%</span></span>
        </slot>
      </li>
    </ul>
  </div>
</template>
