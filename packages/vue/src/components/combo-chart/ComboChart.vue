<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { cn } from '@ousi-ui/core'
import { barPath, linearPath, monotonePath, niceDomain } from './combo-chart.utils'
import { useFocus, useRoving } from '../chart-shared'
import type { ComboChartPoint, ComboChartProps, ComboChartSlots } from './combo-chart.types'

const props = withDefaults(defineProps<ComboChartProps>(), {
  height: 260,
  grid: true,
  curve: 'smooth',
  barRadius: 10,
  barCorners: 'all',
  showPoints: true,
  showXAxis: true,
  showBarAxis: true,
  showLineAxis: true,
  barGap: 0.4,
  interactive: true,
  tooltip: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [index: number | null]
  /** Pointer or keyboard focus enters a category. */
  'point-enter': [point: ComboChartPoint, event: Event]
  /** Pointer or keyboard focus leaves a category. */
  'point-leave': [point: ComboChartPoint, event: Event]
  /** A category is clicked (or activated with Enter/Space). */
  'point-click': [point: ComboChartPoint, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.data.length)
defineSlots<ComboChartSlots>()

const BAR_COLOR = 'var(--ousi-accent)'
const LINE_COLOR = 'var(--ousi-orange)'
const TICKS = 4

// Fluid width
const root = ref<HTMLElement | null>(null)
const width = ref(640)
let observer: ResizeObserver | null = null

// Entrance animation
const mounted = ref(false)
const motion = ref(true)

onMounted(() => {
  if (root.value) {
    width.value = root.value.clientWidth || width.value
    observer = new ResizeObserver(([entry]) => { width.value = entry.contentRect.width || width.value })
    observer.observe(root.value)
  }
  motion.value = props.animated && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!motion.value) { mounted.value = true; return }
  requestAnimationFrame(() => requestAnimationFrame(() => { mounted.value = true }))
})
onBeforeUnmount(() => observer?.disconnect())

const pad = computed(() => ({
  top: props.padding?.top ?? 16,
  right: props.padding?.right ?? (props.line && props.showLineAxis ? 52 : 12),
  bottom: props.padding?.bottom ?? (props.showXAxis ? 30 : 8),
  left: props.padding?.left ?? (props.showBarAxis ? 48 : 12),
}))

const plot = computed(() => ({
  x0: pad.value.left,
  x1: Math.max(width.value - pad.value.right, pad.value.left + 1),
  y0: pad.value.top,
  y1: Math.max(props.height - pad.value.bottom, pad.value.top + 1),
}))

const fmt = (n: number) => n.toLocaleString()
const barFmt = computed(() => props.bar.format ?? fmt)
const lineFmt = computed(() => props.line?.format ?? fmt)

const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0)

const barValues = computed(() => props.data.map((d) => num(d[props.bar.key])))
const lineValues = computed(() => (props.line ? props.data.map((d) => num(d[props.line!.key])) : []))

const barDomain = computed(() => niceDomain(0, Math.max(...barValues.value, 0), TICKS, 0))
const lineDomain = computed(() =>
  lineValues.value.length ? niceDomain(Math.min(...lineValues.value), Math.max(...lineValues.value), TICKS) : null,
)

const yBar = (v: number) => {
  const { lo, hi } = barDomain.value
  return plot.value.y1 - ((v - lo) / (hi - lo || 1)) * (plot.value.y1 - plot.value.y0)
}
const yLine = (v: number) => {
  const d = lineDomain.value!
  return plot.value.y1 - ((v - d.lo) / (d.hi - d.lo || 1)) * (plot.value.y1 - plot.value.y0)
}

const band = computed(() => (plot.value.x1 - plot.value.x0) / Math.max(props.data.length, 1))
const cx = (i: number) => plot.value.x0 + band.value * (i + 0.5)

const ticks = computed(() =>
  Array.from({ length: TICKS + 1 }, (_, i) => {
    const t = i / TICKS
    const bar = barDomain.value.lo + t * (barDomain.value.hi - barDomain.value.lo)
    const line = lineDomain.value ? lineDomain.value.lo + t * (lineDomain.value.hi - lineDomain.value.lo) : null
    return {
      y: plot.value.y1 - t * (plot.value.y1 - plot.value.y0),
      bar: barFmt.value(bar),
      line: line == null ? null : lineFmt.value(line),
    }
  }),
)

const barColor = computed(() => props.bar.color ?? BAR_COLOR)
const lineColor = computed(() => props.line?.color ?? LINE_COLOR)

const points = computed<ComboChartPoint[]>(() =>
  props.data.map((datum, index) => ({
    index,
    datum,
    category: String(datum[props.categoryKey] ?? ''),
    x: cx(index),
    bar: {
      value: barValues.value[index],
      formatted: barFmt.value(barValues.value[index]),
      color: barColor.value,
      label: props.bar.label ?? props.bar.key,
    },
    line: props.line
      ? {
          value: lineValues.value[index],
          formatted: lineFmt.value(lineValues.value[index]),
          color: lineColor.value,
          label: props.line.label ?? props.line.key,
        }
      : null,
  })),
)

const bars = computed(() => {
  const bw = band.value * (1 - Math.min(Math.max(props.barGap, 0), 0.9))
  return points.value.map((p) => {
    const y = yBar(p.bar.value)
    const h = Math.max(plot.value.y1 - y, 0)
    return { index: p.index, d: barPath(p.x - bw / 2, y, bw, h, props.barRadius, props.barCorners === 'all') }
  })
})

const linePts = computed<[number, number][]>(() =>
  props.line ? points.value.map((p) => [p.x, yLine(p.line!.value)]) : [],
)
const lineD = computed(() => (props.curve === 'smooth' ? monotonePath(linePts.value) : linearPath(linePts.value)))

const focusedPoint = computed(() => (focused.value == null ? null : points.value[focused.value] ?? null))
const focusedDot = computed(() => (focused.value == null ? null : linePts.value[focused.value] ?? null))

function enter(p: ComboChartPoint, e: Event) {
  if (!props.interactive) return
  setFocused(p.index)
  emit('point-enter', p, e)
}
function leave(p: ComboChartPoint, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('point-leave', p, e)
}
function click(p: ComboChartPoint, e: Event) {
  if (props.interactive) emit('point-click', p, e)
}

const tooltipStyle = computed(() => {
  const p = focusedPoint.value
  if (!p) return {}
  const edge = 90
  const align = p.x < edge ? '0%' : p.x > width.value - edge ? '-100%' : '-50%'
  return { left: `${p.x}px`, top: `${pad.value.top}px`, transform: `translateX(${align})` }
})

const ariaLabel = computed(
  () => props.label ?? `${props.bar.label ?? props.bar.key}${props.line ? ` and ${props.line.label ?? props.line.key}` : ''} by ${props.categoryKey}`,
)
const pointLabel = (p: ComboChartPoint) =>
  `${p.category}: ${p.bar.label} ${p.bar.formatted}${p.line ? `, ${p.line.label} ${p.line.formatted}` : ''}`
</script>

<template>
  <div data-roving-root ref="root" :class="cn('relative w-full select-none', props.class)" :style="{ height: `${height}px` }">
    <svg :width="width" :height="height" class="block overflow-visible" role="group" :aria-label="ariaLabel">
      <!-- Grid + axes -->
      <g aria-hidden="true">
        <g v-for="(t, i) in ticks" :key="i">
          <line
            v-if="grid"
            :x1="plot.x0" :x2="plot.x1" :y1="t.y" :y2="t.y"
            stroke="color-mix(in srgb, var(--ousi-foreground) 9%, transparent)"
            :stroke-dasharray="i === 0 ? undefined : '3 4'"
          />
          <text v-if="showBarAxis" :x="plot.x0 - 10" :y="t.y" text-anchor="end" dominant-baseline="central" class="fill-ousi-muted text-[11px] tabular-nums">
            {{ t.bar }}
          </text>
          <text
            v-if="showLineAxis && t.line != null"
            :x="plot.x1 + 10" :y="t.y" text-anchor="start" dominant-baseline="central"
            class="text-[11px] tabular-nums" :style="{ fill: lineColor }"
          >
            {{ t.line }}
          </text>
        </g>
        <text
          v-for="p in (showXAxis ? points : [])" :key="p.index"
          :x="p.x" :y="plot.y1 + 18" text-anchor="middle"
          class="text-[11px] transition-colors"
          :class="focused === p.index ? 'fill-ousi-foreground' : 'fill-ousi-muted'"
        >
          {{ p.category }}
        </text>
      </g>

      <!-- Bars -->
      <g>
        <path
          v-for="b in bars" :key="b.index"
          :d="b.d"
          :style="{
            d: `path('${b.d}')`,
            fill: barColor,
            opacity: focused != null && focused !== b.index ? 0.3 : 1,
            filter: focused === b.index ? 'brightness(0.86)' : 'none',
            transformBox: 'fill-box',
            transformOrigin: 'bottom',
            transform: `scaleY(${mounted ? 1 : 0})`,
            transition: motion
              ? `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${b.index * 40}ms, d 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms, filter 200ms`
              : 'opacity 200ms, filter 200ms',
          }"
        />
      </g>

      <!-- Line -->
      <g v-if="line">
        <path
          :d="lineD"
          fill="none"
          :stroke="lineColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          pathLength="1"
          stroke-dasharray="1"
          :style="{
            d: `path('${lineD}')`,
            strokeDashoffset: mounted ? 0 : 1,
            transition: motion ? 'stroke-dashoffset 1100ms cubic-bezier(0.22, 1, 0.36, 1) 250ms, d 500ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          }"
        />
        <!-- Persistent points -->
        <g v-if="showPoints" class="pointer-events-none">
          <circle
            v-for="(pt, i) in linePts" :key="i"
            :cx="pt[0]" :cy="pt[1]"
            :r="focused === i ? 5.5 : 3.5"
            :fill="lineColor" stroke="var(--ousi-background)" stroke-width="2"
            :style="{
              opacity: mounted ? (focused != null && focused !== i ? 0.5 : 1) : 0,
              transition: motion ? `r 150ms ease-out, opacity 300ms ease-out ${mounted ? 0 : 0}ms` : 'r 150ms ease-out, opacity 200ms',
              transitionDelay: motion && mounted ? `${600 + i * 60}ms, 0ms` : '0ms',
            }"
          />
        </g>
        <!-- Pulse on the focused point -->
        <g v-if="focusedDot" class="pointer-events-none">
          <circle :cx="focusedDot[0]" :cy="focusedDot[1]" r="5" :fill="lineColor" class="combo-chart-pulse" />
          <circle
            v-if="!showPoints"
            :cx="focusedDot[0]" :cy="focusedDot[1]" r="5"
            :fill="lineColor" stroke="var(--ousi-background)" stroke-width="2"
          />
        </g>
      </g>

      <!-- Hit areas -->
      <g v-if="interactive">
        <rect
          v-for="p in points" :key="p.index"
          :x="p.x - band / 2" :y="plot.y0" :width="band" :height="plot.y1 - plot.y0 + (showXAxis ? 24 : 8)"
          fill="transparent"
          class="cursor-pointer outline-none"
          :tabindex="roving.tabindexFor(p.index, true)" :data-roving="p.index" @focusin="roving.activate(p.index)" @keydown="roving.onKeydown($event, p.index)"
          role="img"
          :aria-label="pointLabel(p)"
          @mouseenter="enter(p, $event)"
          @mouseleave="leave(p, $event)"
          @focus="enter(p, $event)"
          @blur="leave(p, $event)"
          @click="click(p, $event)"
          @keydown.enter.prevent="click(p, $event)"
          @keydown.space.prevent="click(p, $event)"
        />
      </g>
    </svg>

    <!-- Tooltip -->
    <div
      v-if="tooltip && focusedPoint"
      class="pointer-events-none absolute z-10 min-w-36 rounded-xl border border-ousi-border bg-ousi-overlay px-3 py-2 text-xs shadow-lg"
      :style="tooltipStyle"
    >
      <slot name="tooltip" :point="focusedPoint">
        <div class="mb-1.5 font-medium text-ousi-foreground">{{ focusedPoint.category }}</div>
        <div class="flex items-center justify-between gap-4">
          <span class="flex items-center gap-1.5 text-ousi-muted">
            <span class="inline-block size-2 rounded-sm" :style="{ backgroundColor: focusedPoint.bar.color }" />
            {{ focusedPoint.bar.label }}
          </span>
          <span class="font-medium tabular-nums text-ousi-foreground">{{ focusedPoint.bar.formatted }}</span>
        </div>
        <div v-if="focusedPoint.line" class="mt-1 flex items-center justify-between gap-4">
          <span class="flex items-center gap-1.5 text-ousi-muted">
            <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: focusedPoint.line.color }" />
            {{ focusedPoint.line.label }}
          </span>
          <span class="font-medium tabular-nums text-ousi-foreground">{{ focusedPoint.line.formatted }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.combo-chart-pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: combo-chart-ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes combo-chart-ping {
  0% { transform: scale(1); opacity: 0.5; }
  80%, 100% { transform: scale(2.6); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .combo-chart-pulse { animation: none; opacity: 0; }
}
</style>
