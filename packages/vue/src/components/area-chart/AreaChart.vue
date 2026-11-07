<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { cn } from '@ousi-ui/core'
import { chartGridColor, resolveChartColor, useChartMotion, useElementWidth, useFocus, useRoving, visibleLabels } from '../chart-shared'
import { linearPath, monotonePath, niceDomain } from '../combo-chart/combo-chart.utils'
import type { AreaChartPoint, AreaChartProps, AreaChartSlots } from './area-chart.types'

const props = withDefaults(defineProps<AreaChartProps>(), {
  height: 260,
  grid: true,
  curve: 'smooth',
  baseline: 'zero',
  fillOpacity: 0.28,
  showXAxis: true,
  showYAxis: true,
  showPoints: false,
  interactive: true,
  tooltip: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [index: number | null]
  'point-enter': [point: AreaChartPoint, event: Event]
  'point-leave': [point: AreaChartPoint, event: Event]
  'point-click': [point: AreaChartPoint, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.data.length)
defineSlots<AreaChartSlots>()

const uid = useId()
const root = ref<HTMLElement | null>(null)
const width = useElementWidth(root)
const { mounted, motion } = useChartMotion(() => props.animated)
const TICKS = 4

const pad = computed(() => ({
  top: props.padding?.top ?? 16,
  right: props.padding?.right ?? 20,
  bottom: props.padding?.bottom ?? (props.showXAxis ? 30 : 10),
  left: props.padding?.left ?? (props.showYAxis ? 48 : 20),
}))
const plot = computed(() => ({
  x0: pad.value.left,
  x1: Math.max(width.value - pad.value.right, pad.value.left + 1),
  y0: pad.value.top,
  y1: Math.max(props.height - pad.value.bottom, pad.value.top + 1),
}))

const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()
const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0)

const resolved = computed(() =>
  props.series.map((s, i) => ({
    ...s,
    label: s.label ?? s.key,
    color: resolveChartColor(s.color, i),
    fill: s.fill ?? !s.dashed,
    format: s.format ?? fmt,
    values: props.data.map((d) => num(d[s.key])),
  })),
)

const domain = computed(() => {
  const all = resolved.value.flatMap((s) => s.values)
  const lo = all.length ? Math.min(...all) : 0
  const hi = all.length ? Math.max(...all) : 1
  return props.baseline === 'zero' ? niceDomain(0, Math.max(hi, 0), TICKS, 0) : niceDomain(lo, hi, TICKS)
})

const yOf = (v: number) => {
  const { lo, hi } = domain.value
  return plot.value.y1 - ((v - lo) / (hi - lo || 1)) * (plot.value.y1 - plot.value.y0)
}
const n = computed(() => props.data.length)
const xOf = (i: number) =>
  n.value <= 1 ? (plot.value.x0 + plot.value.x1) / 2 : plot.value.x0 + (i / (n.value - 1)) * (plot.value.x1 - plot.value.x0)
const step = computed(() => (n.value > 1 ? (plot.value.x1 - plot.value.x0) / (n.value - 1) : plot.value.x1 - plot.value.x0))

const ticks = computed(() =>
  Array.from({ length: TICKS + 1 }, (_, i) => {
    const t = i / TICKS
    return { y: plot.value.y1 - t * (plot.value.y1 - plot.value.y0), label: fmt(domain.value.lo + t * (domain.value.hi - domain.value.lo)) }
  }),
)

const paths = computed(() =>
  resolved.value.map((s) => {
    const pts = s.values.map((v, i) => [xOf(i), yOf(v)] as [number, number])
    const line = props.curve === 'smooth' ? monotonePath(pts) : linearPath(pts)
    const area = pts.length ? `${line}L${pts[pts.length - 1][0]},${plot.value.y1}L${pts[0][0]},${plot.value.y1}Z` : ''
    return { line, area, pts }
  }),
)

// Only the dots that are visible are rendered: all of them with `showPoints`, otherwise just the hovered one.
const dots = computed(() =>
  paths.value.map((p) =>
    props.showPoints
      ? p.pts.map((pt, k) => ({ k, pt }))
      : focused.value != null && p.pts[focused.value]
        ? [{ k: focused.value, pt: p.pts[focused.value] }]
        : [],
  ),
)

const points = computed<AreaChartPoint[]>(() =>
  props.data.map((datum, index) => ({
    index,
    datum,
    category: String(datum[props.categoryKey] ?? ''),
    x: xOf(index),
    values: resolved.value.map((s) => ({
      key: s.key,
      label: s.label,
      value: s.values[index],
      formatted: s.format(s.values[index]),
      color: s.color,
    })),
  })),
)
// Category labels that fit: thinned out on narrow screens instead of piling up
const showCat = computed(() => visibleLabels(points.value.map((p) => p.category), points.value.map((p) => p.x)))

const focusedPoint = computed(() => (focused.value == null ? null : points.value[focused.value] ?? null))

function enter(p: AreaChartPoint, e: Event) {
  if (!props.interactive) return
  setFocused(p.index)
  emit('point-enter', p, e)
}
function leave(p: AreaChartPoint, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('point-leave', p, e)
}
function click(p: AreaChartPoint, e: Event) {
  if (props.interactive) emit('point-click', p, e)
}

const tooltipStyle = computed(() => {
  const p = focusedPoint.value
  if (!p) return {}
  const edge = 90
  const align = p.x < edge ? '0%' : p.x > width.value - edge ? '-100%' : '-50%'
  return { left: `${p.x}px`, top: `${pad.value.top}px`, transform: `translateX(${align})` }
})

const ariaLabel = computed(() => props.label ?? `${resolved.value.map((s) => s.label).join(', ')} by ${props.categoryKey}`)
</script>

<template>
  <div data-roving-root ref="root" :class="cn('relative w-full min-w-0 max-w-full select-none', props.class)" :style="{ height: `${height}px` }">
    <svg width="100%" :height="height" class="block overflow-visible" role="group" :aria-label="ariaLabel">
      <defs>
        <linearGradient v-for="(s, i) in resolved" :id="`${uid}-g${i}`" :key="s.key" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="s.color" :stop-opacity="fillOpacity" />
          <stop offset="100%" :stop-color="s.color" stop-opacity="0" />
        </linearGradient>
        <clipPath :id="`${uid}-clip`">
          <rect
            :x="plot.x0 - 8" :y="0" :height="height + 8"
            :width="mounted ? plot.x1 - plot.x0 + 24 : 0"
            :style="{ transition: motion ? 'width 1100ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none' }"
          />
        </clipPath>
      </defs>

      <g aria-hidden="true">
        <g v-for="(t, i) in ticks" :key="i">
          <line
            v-if="grid" :x1="plot.x0" :x2="plot.x1" :y1="t.y" :y2="t.y"
            :stroke="chartGridColor" :stroke-dasharray="i === 0 ? undefined : '3 4'"
          />
          <text
            v-if="showYAxis" :x="plot.x0 - 10" :y="t.y" text-anchor="end" dominant-baseline="central"
            class="fill-ousi-muted text-[11px] tabular-nums"
          >{{ t.label }}</text>
        </g>
        <template v-if="showXAxis">
          <text
            v-for="p in points.filter((q) => showCat[q.index])" :key="p.index"
            :x="p.x" :y="plot.y1 + 18" text-anchor="middle"
            class="text-[11px] transition-colors"
            :class="focused === p.index ? 'fill-ousi-foreground' : 'fill-ousi-muted'"
          >{{ p.category }}</text>
        </template>
      </g>

      <!-- Crosshair -->
      <line
        v-if="focusedPoint"
        :x1="focusedPoint.x" :x2="focusedPoint.x" :y1="plot.y0" :y2="plot.y1"
        stroke="color-mix(in srgb, var(--ousi-foreground) 25%, transparent)" stroke-dasharray="3 3"
      />

      <g :clip-path="`url(#${uid}-clip)`">
        <!-- Areas first (behind), then lines -->
        <template v-for="(s, i) in resolved" :key="`a-${s.key}`">
          <path v-if="s.fill" :d="paths[i].area" :fill="`url(#${uid}-g${i})`" />
        </template>
        <path
          v-for="(s, i) in resolved" :key="`l-${s.key}`"
          :d="paths[i].line" fill="none" :stroke="s.color"
          :stroke-width="s.strokeWidth ?? 2.5" stroke-linecap="round" stroke-linejoin="round"
          :stroke-dasharray="s.dashed ? '5 5' : undefined"
        />
      </g>

      <!-- Points -->
      <g class="pointer-events-none">
        <template v-for="(s, i) in resolved" :key="`p-${s.key}`">
          <template v-if="showPoints || focusedPoint">
            <circle
              v-for="d in dots[i]" :key="d.k"
              :cx="d.pt[0]" :cy="d.pt[1]" :r="focused === d.k ? 5 : 3.5"
              :fill="s.color" stroke="var(--ousi-background)" stroke-width="2"
              :style="{ opacity: mounted ? 1 : 0, transition: 'r 150ms ease-out, opacity 400ms ease-out 700ms' }"
            />
          </template>
        </template>
      </g>

      <!-- Hit areas -->
      <g v-if="interactive">
        <rect
          v-for="p in points" :key="p.index"
          :x="p.x - step / 2" :y="plot.y0" :width="step" :height="plot.y1 - plot.y0 + (showXAxis ? 24 : 8)"
          fill="transparent" class="cursor-pointer outline-none" :tabindex="roving.tabindexFor(p.index, true)" :data-roving="p.index" @focusin="roving.activate(p.index)" @keydown="roving.onKeydown($event, p.index)" role="img"
          :aria-label="`${p.category}: ${p.values.map((v) => `${v.label} ${v.formatted}`).join(', ')}`"
          @mouseenter="enter(p, $event)" @mouseleave="leave(p, $event)"
          @focus="enter(p, $event)" @blur="leave(p, $event)"
          @click="click(p, $event)" @keydown.enter.prevent="click(p, $event)" @keydown.space.prevent="click(p, $event)"
        />
      </g>
    </svg>

    <div
      v-if="tooltip && focusedPoint"
      class="pointer-events-none absolute z-10 min-w-36 rounded-xl border border-ousi-border bg-ousi-overlay px-3 py-2 text-xs shadow-lg"
      :style="tooltipStyle"
    >
      <slot name="tooltip" :point="focusedPoint">
        <div class="mb-1.5 font-medium text-ousi-foreground">{{ focusedPoint.category }}</div>
        <div v-for="v in focusedPoint.values" :key="v.key" class="mt-1 flex items-center justify-between gap-4 first:mt-0">
          <span class="flex items-center gap-1.5 text-ousi-muted">
            <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: v.color }" />{{ v.label }}
          </span>
          <span class="font-medium tabular-nums text-ousi-foreground">{{ v.formatted }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>
