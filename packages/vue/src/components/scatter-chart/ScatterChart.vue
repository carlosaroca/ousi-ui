<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@ousi-ui/core'
import { chartGridColor, resolveChartColor, useChartMotion, useElementWidth, useFocus, useRoving } from '../chart-shared'
import { niceDomain } from '../combo-chart/combo-chart.utils'
import type { ScatterChartProps, ScatterChartSlots, ScatterFocus, ScatterItem } from './scatter-chart.types'

const props = withDefaults(defineProps<ScatterChartProps>(), {
  height: 300,
  bubble: undefined,
  radius: () => [5, 18],
  grid: true,
  showXAxis: true,
  showYAxis: true,
  interactive: true,
  tooltip: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [focus: ScatterFocus | null]
  'point-enter': [item: ScatterItem, event: Event]
  'point-leave': [item: ScatterItem, event: Event]
  'point-click': [item: ScatterItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => totalPoints.value)
defineSlots<ScatterChartSlots>()

const root = ref<HTMLElement | null>(null)
const width = useElementWidth(root)
const { mounted, motion } = useChartMotion(() => props.animated)
const TICKS = 4

// Flat index of a point across all series, for keyboard navigation
const offsets = computed(() => {
  let acc = 0
  return props.series.map((x) => { const o = acc; acc += x.points.length; return o })
})
const totalPoints = computed(() => props.series.reduce((t, x) => t + x.points.length, 0))
const flat = (it: ScatterItem) => offsets.value[it.seriesIndex] + it.pointIndex

const hasZ = computed(() => props.series.some((s) => s.points.some((p) => p.z != null)))
const isBubble = computed(() => props.bubble ?? hasZ.value)

const pad = computed(() => ({
  top: props.padding?.top ?? 20,
  right: props.padding?.right ?? 24,
  bottom: props.padding?.bottom ?? (props.showXAxis ? (props.axisLabels?.x ? 48 : 32) : 12),
  left: props.padding?.left ?? (props.showYAxis ? (props.axisLabels?.y ? 64 : 48) : 16),
}))
const plot = computed(() => ({
  x0: pad.value.left,
  x1: Math.max(width.value - pad.value.right, pad.value.left + 1),
  y0: pad.value.top,
  y1: Math.max(props.height - pad.value.bottom, pad.value.top + 1),
}))

const all = computed(() => props.series.flatMap((s) => s.points))
const xDomain = computed(() => niceDomain(Math.min(...all.value.map((p) => p.x), 0), Math.max(...all.value.map((p) => p.x), 1), TICKS))
const yDomain = computed(() => niceDomain(Math.min(...all.value.map((p) => p.y), 0), Math.max(...all.value.map((p) => p.y), 1), TICKS))
const zRange = computed(() => {
  const zs = all.value.map((p) => p.z).filter((z): z is number => z != null)
  return { min: zs.length ? Math.min(...zs) : 0, max: zs.length ? Math.max(...zs) : 1 }
})

const fx = (n: number) => props.formatX?.(n) ?? n.toLocaleString()
const fy = (n: number) => props.formatY?.(n) ?? n.toLocaleString()
const xOf = (v: number) => plot.value.x0 + ((v - xDomain.value.lo) / (xDomain.value.hi - xDomain.value.lo || 1)) * (plot.value.x1 - plot.value.x0)
const yOf = (v: number) => plot.value.y1 - ((v - yDomain.value.lo) / (yDomain.value.hi - yDomain.value.lo || 1)) * (plot.value.y1 - plot.value.y0)
// Dots scale down on narrow charts so a phone does not get a screen full of overlapping bubbles
const sizeK = computed(() => Math.min(1, Math.max(0.55, width.value / 520)))
const rOf = (p: { z?: number }) => {
  const [a, b] = props.radius
  if (!isBubble.value || p.z == null) return Math.max(a, 6) * sizeK.value
  const t = (p.z - zRange.value.min) / (zRange.value.max - zRange.value.min || 1)
  return (a + Math.sqrt(t) * (b - a)) * sizeK.value
}

const items = computed<ScatterItem[][]>(() =>
  props.series.map((s, seriesIndex) =>
    s.points.map((point, pointIndex) => ({
      seriesIndex,
      pointIndex,
      series: s.label,
      color: resolveChartColor(s.color, seriesIndex),
      point,
      cx: xOf(point.x),
      cy: yOf(point.y),
      formattedX: fx(point.x),
      formattedY: fy(point.y),
    })),
  ),
)

const ticksX = computed(() =>
  Array.from({ length: TICKS + 1 }, (_, i) => {
    const v = xDomain.value.lo + (i / TICKS) * (xDomain.value.hi - xDomain.value.lo)
    return { x: xOf(v), label: fx(v) }
  }),
)
const ticksY = computed(() =>
  Array.from({ length: TICKS + 1 }, (_, i) => {
    const v = yDomain.value.lo + (i / TICKS) * (yDomain.value.hi - yDomain.value.lo)
    return { y: yOf(v), label: fy(v) }
  }),
)

const focusedItem = computed(() =>
  focused.value ? items.value[focused.value.series]?.[focused.value.point] ?? null : null,
)
const isFocused = (it: ScatterItem) => focused.value?.series === it.seriesIndex && focused.value?.point === it.pointIndex

function enter(it: ScatterItem, e: Event) {
  if (!props.interactive) return
  setFocused({ series: it.seriesIndex, point: it.pointIndex })
  emit('point-enter', it, e)
}
function leave(it: ScatterItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('point-leave', it, e)
}
function click(it: ScatterItem, e: Event) {
  if (props.interactive) emit('point-click', it, e)
}

const tooltipStyle = computed(() => {
  const it = focusedItem.value
  if (!it) return {}
  const r = rOf(it.point)
  const flip = it.cx > width.value - 150
  return {
    left: `${it.cx}px`,
    top: `${it.cy - r - 10}px`,
    transform: `translate(${flip ? '-100%' : '-50%'}, -100%)`,
  }
})

const ariaLabel = computed(() => props.label ?? `Scatter chart: ${props.series.map((s) => s.label).join(', ')}`)
</script>

<template>
  <div data-roving-root ref="root" :class="cn('relative w-full min-w-0 max-w-full select-none', props.class)" :style="{ height: `${height}px` }">
    <svg width="100%" :height="height" class="block overflow-visible" role="group" :aria-label="ariaLabel">
      <g aria-hidden="true">
        <g v-for="(t, i) in ticksY" :key="`y${i}`">
          <line v-if="grid" :x1="plot.x0" :x2="plot.x1" :y1="t.y" :y2="t.y" :stroke="chartGridColor" :stroke-dasharray="i === 0 ? undefined : '3 4'" />
          <text v-if="showYAxis" :x="plot.x0 - 10" :y="t.y" text-anchor="end" dominant-baseline="central" class="fill-ousi-muted text-[11px] tabular-nums">{{ t.label }}</text>
        </g>
        <g v-for="(t, i) in ticksX" :key="`x${i}`">
          <line v-if="grid && i > 0" :x1="t.x" :x2="t.x" :y1="plot.y0" :y2="plot.y1" :stroke="chartGridColor" stroke-dasharray="3 4" />
          <text v-if="showXAxis" :x="t.x" :y="plot.y1 + 18" text-anchor="middle" class="fill-ousi-muted text-[11px] tabular-nums">{{ t.label }}</text>
        </g>
        <text v-if="showXAxis && axisLabels?.x" :x="(plot.x0 + plot.x1) / 2" :y="plot.y1 + 40" text-anchor="middle" class="fill-ousi-muted text-[11px]">{{ axisLabels.x }}</text>
        <text
          v-if="showYAxis && axisLabels?.y"
          :x="14" :y="(plot.y0 + plot.y1) / 2" text-anchor="middle" class="fill-ousi-muted text-[11px]"
          :transform="`rotate(-90 14 ${(plot.y0 + plot.y1) / 2})`"
        >{{ axisLabels.y }}</text>
      </g>

      <!-- Dimming is applied once per series (a group), not on every point: one style change instead of hundreds -->
      <g
        v-for="(list, si) in items"
        :key="si"
        :style="{ opacity: focused != null && focused.series !== si ? 0.15 : 1, transition: 'opacity 200ms ease-out' }"
      >
        <circle
          v-for="it in list" :key="it.pointIndex"
          :cx="it.cx" :cy="it.cy" :r="rOf(it.point) + (isFocused(it) ? 2 : 0)"
          :fill="it.color" :fill-opacity="isFocused(it) ? 0.85 : 0.55"
          :stroke="it.color" stroke-width="1.5"
          :class="interactive && 'cursor-pointer outline-none'"
          :tabindex="roving.tabindexFor(flat(it), interactive)" :data-roving="flat(it)" @focusin="roving.activate(flat(it))" @keydown="roving.onKeydown($event, flat(it))"
          role="img"
          :aria-label="`${it.series}${it.point.label ? ` ${it.point.label}` : ''}: ${it.formattedX}, ${it.formattedY}`"
          :style="{
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transform: `scale(${mounted ? 1 : 0})`,
            transition: motion
              ? `transform 500ms cubic-bezier(0.22, 1, 0.36, 1) ${(si * 6 + it.pointIndex) * 25}ms, r 150ms`
              : 'r 150ms',
          }"
          @mouseenter="enter(it, $event)" @mouseleave="leave(it, $event)"
          @focus="enter(it, $event)" @blur="leave(it, $event)"
          @click="click(it, $event)" @keydown.enter.prevent="click(it, $event)" @keydown.space.prevent="click(it, $event)"
        />
      </g>
    </svg>

    <div
      v-if="tooltip && focusedItem"
      class="pointer-events-none absolute z-10 min-w-32 rounded-xl border border-ousi-border bg-ousi-overlay px-3 py-2 text-xs shadow-lg"
      :style="tooltipStyle"
    >
      <slot name="tooltip" :item="focusedItem">
        <div class="mb-1 flex items-center gap-1.5 font-medium text-ousi-foreground">
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: focusedItem.color }" />
          {{ focusedItem.point.label ?? focusedItem.series }}
        </div>
        <div class="flex justify-between gap-4 text-ousi-muted"><span>{{ axisLabels?.x ?? 'x' }}</span><span class="tabular-nums text-ousi-foreground">{{ focusedItem.formattedX }}</span></div>
        <div class="flex justify-between gap-4 text-ousi-muted"><span>{{ axisLabels?.y ?? 'y' }}</span><span class="tabular-nums text-ousi-foreground">{{ focusedItem.formattedY }}</span></div>
        <div v-if="focusedItem.point.z != null" class="flex justify-between gap-4 text-ousi-muted"><span>size</span><span class="tabular-nums text-ousi-foreground">{{ focusedItem.point.z.toLocaleString() }}</span></div>
      </slot>
    </div>
  </div>
</template>
