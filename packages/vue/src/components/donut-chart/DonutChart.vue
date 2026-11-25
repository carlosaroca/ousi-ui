<script setup lang="ts">
import { computed, useId } from 'vue'
import { cn } from '@ousi-ui/core'
import { jointedArcs, pointAt, resolveChartColor, useChartMotion, useFocus, useRoving } from '../chart-shared'
import type { DonutChartProps, DonutChartSlots, DonutItem } from './donut-chart.types'

const props = withDefaults(defineProps<DonutChartProps>(), {
  variant: 'donut',
  size: 220,
  thickness: 16,
  gap: 2,
  rounded: true,
  joined: false,
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

// A pie has no band to round.
const isRound = computed(() => props.rounded && props.variant === 'donut')

const arcs = computed(() => {
  if (isRound.value) {
    const round = jointedArcs({
      sizes: items.value.map((it) => Math.max(it.value, 0)),
      start: -90,
      sweep: 360,
      radius: R.value,
      thickness: stroke.value,
      gap: props.gap,
      joined: props.joined,
      // Shares are what a donut is read for, so a tiny one is lifted as little as can be seen.
      least: 0.3,
    })
    return round.map((arc) => ({ d: arc?.d ?? '', clip: arc?.clip, mid: (arc?.mid ?? -90) + 90 }))
  }
  // Flat: straight ends, set apart by an angle.
  const visible = items.value.filter((i) => i.value > 0).length
  const gap = visible > 1 && !props.joined ? props.gap : 0
  const usable = 360 - gap * visible
  let cursor = gap / 2
  return items.value.map((it) => {
    const span = total.value ? (usable * Math.max(it.value, 0)) / total.value : 0
    const mid = cursor + span / 2
    const a0 = cursor
    const a1 = Math.min(cursor + span, a0 + 359.9)
    cursor += span + gap
    return { d: arcPath(a0, Math.max(a1, a0 + 0.01)), clip: undefined as string | undefined, mid }
  })
})

/** Angles of the donut are measured from 12 o'clock. */
const pt = (deg: number, r: number): [number, number] => {
  const { x, y } = pointAt(deg - 90, r)
  return [x, y]
}
function arcPath(a0: number, a1: number) {
  const [x0, y0] = pt(a0, R.value)
  const [x1, y1] = pt(a1, R.value)
  return `M${x0},${y0}A${R.value},${R.value} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}`
}

// Clip paths are shared by id across the page.
const clipId = useId()

function offset(i: number) {
  // A joined ring with round ends is one piece: pulled apart, the ends fitted into each other show.
  const onePiece = isRound.value && (props.joined || props.gap <= 0)
  if (focused.value !== i || onePiece) return 'translate(0px, 0px)'
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

// Hole of the donut as a percentage of the chart, so the center follows the chart when it shrinks
const holePct = computed(() => (R.value - stroke.value / 2) * 2)
const ariaLabel = computed(() => props.label ?? items.value.map((i) => `${i.label} ${i.percent}%`).join(', '))
</script>

<template>
  <div data-roving-root :class="cn('inline-flex flex-col items-center gap-5', props.class)">
    <div class="relative max-w-full shrink-0" role="img" :aria-label="ariaLabel">
      <svg :width="size" :height="size" viewBox="0 0 100 100" class="block h-auto max-w-full overflow-visible" fill="none">
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
          <clipPath v-if="it.value > 0 && arcs[i].clip" :id="`${clipId}-${i}`">
            <path :d="arcs[i].clip" clip-rule="evenodd" />
          </clipPath>
          <!-- The dash gap is longer than the line: otherwise, while it is still empty, a repeat of
               the dash starts at its end and its round cap shows as a dot. -->
          <path
            v-if="it.value > 0"
            data-part="segment"
            :d="arcs[i].d"
            :clip-path="arcs[i].clip ? `url(#${clipId}-${i})` : undefined"
            :stroke="it.color"
            :stroke-width="stroke"
            :stroke-linecap="isRound ? 'round' : 'butt'"
            pathLength="1"
            stroke-dasharray="1 2"
            :stroke-dashoffset="mounted ? 0 : 1"
            :style="{ transition: motion ? `stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 110}ms` : 'none' }"
          />
        </g>
      </svg>

      <div
        v-if="variant === 'donut'"
        class="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center"
        :style="{ width: `${holePct}%`, height: `${holePct}%`, containerType: 'inline-size' }"
      >
        <slot :total="total" :formatted-total="fmt(total)" :focused-item="focusedItem">
          <div class="px-2">
            <div class="truncate font-semibold leading-tight tabular-nums text-ousi-foreground" :style="{ fontSize: 'clamp(10px, 17cqw, 30px)' }">{{ focusedItem ? focusedItem.formatted : fmt(total) }}</div>
            <div class="truncate leading-tight text-ousi-muted" :style="{ fontSize: 'clamp(8px, 9cqw, 12px)' }">{{ focusedItem ? `${focusedItem.label} · ${focusedItem.percent}%` : 'Total' }}</div>
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
