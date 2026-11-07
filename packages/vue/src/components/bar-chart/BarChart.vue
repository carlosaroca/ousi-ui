<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { cn } from '@ousi-ui/core'
import { chartGridColor, resolveChartColor, useChartMotion, useElementWidth, useFocus, useRoving, visibleLabels } from '../chart-shared'
import { niceDomain } from '../combo-chart/combo-chart.utils'
import type { BarChartPoint, BarChartProps, BarChartSlots } from './bar-chart.types'

const props = withDefaults(defineProps<BarChartProps>(), {
  orientation: 'vertical',
  stacked: false,
  height: 280,
  track: false,
  trackColor: 'var(--ousi-default)',
  barRadius: 12,
  barGap: 0.35,
  groupGap: 4,
  outline: true,
  dim: false,
  grid: false,
  showXAxis: true,
  showYAxis: true,
  interactive: true,
  tooltip: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [index: number | null]
  'point-enter': [point: BarChartPoint, event: Event]
  'point-leave': [point: BarChartPoint, event: Event]
  'point-click': [point: BarChartPoint, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.data.length)
defineSlots<BarChartSlots>()

const uid = useId()
const root = ref<HTMLElement | null>(null)
const width = useElementWidth(root)
const { mounted, motion } = useChartMotion(() => props.animated)

const horizontal = computed(() => props.orientation === 'horizontal')
const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()
const num = (v: unknown) => Math.max(typeof v === 'number' ? v : Number(v) || 0, 0)

const resolved = computed(() =>
  props.series.map((s, i) => ({ ...s, label: s.label ?? s.key, color: resolveChartColor(s.color, i), format: s.format ?? fmt })),
)

const pad = computed(() => ({
  top: props.padding?.top ?? 12,
  right: props.padding?.right ?? (horizontal.value ? 16 : 12),
  bottom: props.padding?.bottom ?? (horizontal.value ? (props.showYAxis ? 26 : 8) : props.showXAxis ? 30 : 8),
  left: props.padding?.left ?? (horizontal.value ? (props.showXAxis ? 76 : 12) : props.showYAxis ? 48 : 12),
}))
const plot = computed(() => ({
  x0: pad.value.left,
  x1: Math.max(width.value - pad.value.right, pad.value.left + 1),
  y0: pad.value.top,
  y1: Math.max(props.height - pad.value.bottom, pad.value.top + 1),
}))

// Value axis ----------------------------------------------------------
const totals = computed(() =>
  props.data.map((d) => {
    const vals = resolved.value.map((s) => num(d[s.key]))
    return props.stacked ? vals.reduce((a, b) => a + b, 0) : Math.max(...vals, 0)
  }),
)
const dataMax = computed(() => Math.max(...totals.value, 0))
const domainHi = computed(() => {
  if (props.max != null) return props.max
  if (props.ticks?.length) return Math.max(...props.ticks)
  return niceDomain(0, Math.max(dataMax.value, 1), 4, 0).hi
})
const tickValues = computed(() => props.ticks ?? Array.from({ length: 5 }, (_, i) => (domainHi.value * i) / 4))

// Axis geometry: `cat*` runs along the categories, `val*` along the values
const catLen = computed(() => (horizontal.value ? plot.value.y1 - plot.value.y0 : plot.value.x1 - plot.value.x0))
const valBase = computed(() => (horizontal.value ? plot.value.x0 : plot.value.y1))
const valEnd = computed(() => (horizontal.value ? plot.value.x1 : plot.value.y0))
const valPos = (v: number) => valBase.value + (Math.min(v, domainHi.value) / (domainHi.value || 1)) * (valEnd.value - valBase.value)

const n = computed(() => Math.max(props.data.length, 1))
const band = computed(() => catLen.value / n.value)
const catStart = computed(() => (horizontal.value ? plot.value.y0 : plot.value.x0))
const inner = computed(() => band.value * (1 - Math.min(Math.max(props.barGap, 0), 0.9)))
const innerStart = (i: number) => catStart.value + i * band.value + (band.value - inner.value) / 2
const catCenter = (i: number) => catStart.value + (i + 0.5) * band.value

/** Rect from category start/size and value range. */
function rectOf(cs: number, size: number, v0: number, v1: number) {
  const a = valPos(v0)
  const b = valPos(v1)
  const lo = Math.min(a, b)
  const len = Math.abs(b - a)
  return horizontal.value ? { x: lo, y: cs, w: len, h: size } : { x: cs, y: lo, w: size, h: len }
}

const categories = computed(() => props.data.map((d) => String(d[props.categoryKey] ?? '')))

// Category labels that fit: thinned out on narrow screens instead of piling up
const showCat = computed(() =>
  horizontal.value
    ? categories.value.map((_, i) => i % Math.max(Math.ceil(18 / band.value), 1) === 0)
    : visibleLabels(categories.value, categories.value.map((_, i) => catCenter(i))),
)

const points = computed<BarChartPoint[]>(() =>
  props.data.map((datum, index) => {
    const values = resolved.value.map((s) => ({
      key: s.key,
      label: s.label,
      value: num(datum[s.key]),
      formatted: s.format(num(datum[s.key])),
      color: s.color,
    }))
    const total = values.reduce((t, v) => t + v.value, 0)
    const top = valPos(totals.value[index])
    return {
      index,
      datum,
      category: categories.value[index],
      values,
      total,
      formattedTotal: fmt(total),
      x: horizontal.value ? top : catCenter(index),
      y: horizontal.value ? catCenter(index) : top,
    }
  }),
)

// Bars ---------------------------------------------------------------
const bars = computed(() =>
  points.value.map((p) => {
    const start = innerStart(p.index)
    const r = (size: number) => Math.min(props.barRadius, size / 2)
    const track = rectOf(start, inner.value, 0, domainHi.value)
    if (props.stacked) {
      let acc = 0
      const segs = p.values.map((v) => {
        const rect = rectOf(start, inner.value, acc, acc + v.value)
        acc += v.value
        return { ...rect, color: v.color, key: v.key }
      })
      const whole = rectOf(start, inner.value, 0, acc)
      return { track, rx: r(inner.value), segs, whole, grouped: false }
    }
    const m = Math.max(p.values.length, 1)
    const w = (inner.value - (m - 1) * props.groupGap) / m
    const segs = p.values.map((v, k) => ({ ...rectOf(start + k * (w + props.groupGap), w, 0, v.value), color: v.color, key: v.key }))
    return { track, rx: r(w), segs, whole: track, grouped: true }
  }),
)

const ringFor = (b: (typeof bars.value)[number]) => (props.track || props.stacked ? b.track : b.whole)

// The ring stays mounted: it keeps the last hovered category so it can fade out in place,
// and slides from one category to the next instead of jumping.
const ringIndex = ref<number | null>(null)
watch(focused, (v) => { if (v != null) ringIndex.value = v }, { immediate: true })
const ring = computed(() => {
  const b = ringIndex.value != null ? bars.value[ringIndex.value] : null
  if (!b) return null
  const r = ringFor(b)
  const side = horizontal.value ? r.h : r.w
  return { x: r.x - 3, y: r.y - 3, w: r.w + 6, h: r.h + 6, rx: Math.min(props.barRadius, side / 2) + 3 }
})

function enter(p: BarChartPoint, e: Event) {
  if (!props.interactive) return
  setFocused(p.index)
  emit('point-enter', p, e)
}
function leave(p: BarChartPoint, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('point-leave', p, e)
}
function click(p: BarChartPoint, e: Event) {
  if (props.interactive) emit('point-click', p, e)
}

const focusedPoint = computed(() => (focused.value == null ? null : points.value[focused.value] ?? null))
const tooltipStyle = computed(() => {
  const p = focusedPoint.value
  if (!p) return {}
  if (horizontal.value) {
    const flip = p.x > width.value - 190
    return { left: `${flip ? p.x - 12 : p.x + 12}px`, top: `${p.y}px`, transform: `translate(${flip ? '-100%' : '0'}, -50%)` }
  }
  const align = p.x < 90 ? '0%' : p.x > width.value - 90 ? '-100%' : '-50%'
  return { left: `${p.x}px`, top: `${pad.value.top - 4}px`, transform: `translateX(${align})` }
})

const growStyle = (i: number, k = 0) => ({
  transformBox: 'fill-box' as const,
  transformOrigin: horizontal.value ? 'left center' : 'center bottom',
  transform: mounted.value ? 'scale(1)' : horizontal.value ? 'scaleX(0)' : 'scaleY(0)',
  transition: motion.value ? `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 40 + k * 60}ms, filter 200ms, opacity 200ms` : 'filter 200ms, opacity 200ms',
})
const ariaLabel = computed(() => props.label ?? `${resolved.value.map((s) => s.label).join(', ')} by ${props.categoryKey}`)
</script>

<template>
  <div data-roving-root ref="root" :class="cn('relative w-full min-w-0 max-w-full select-none', props.class)" :style="{ height: `${height}px` }">
    <svg width="100%" :height="height" class="block overflow-visible" role="group" :aria-label="ariaLabel">
      <defs v-if="stacked">
        <clipPath v-for="(b, i) in bars" :id="`${uid}-c${i}`" :key="i">
          <rect :x="b.whole.x" :y="b.whole.y" :width="b.whole.w" :height="b.whole.h" :rx="b.rx" />
        </clipPath>
      </defs>

      <!-- Value axis -->
      <g aria-hidden="true">
        <g v-for="(t, i) in tickValues" :key="i">
          <template v-if="horizontal">
            <line v-if="grid" :x1="valPos(t)" :x2="valPos(t)" :y1="plot.y0" :y2="plot.y1" :stroke="chartGridColor" stroke-dasharray="3 4" />
            <text v-if="showYAxis" :x="valPos(t)" :y="plot.y1 + 18" text-anchor="middle" class="fill-ousi-muted text-[11px] tabular-nums">{{ fmt(t) }}</text>
          </template>
          <template v-else>
            <line v-if="grid" :x1="plot.x0" :x2="plot.x1" :y1="valPos(t)" :y2="valPos(t)" :stroke="chartGridColor" stroke-dasharray="3 4" />
            <text v-if="showYAxis" :x="plot.x0 - 12" :y="valPos(t)" text-anchor="end" dominant-baseline="central" class="fill-ousi-muted text-[11px] tabular-nums">{{ fmt(t) }}</text>
          </template>
        </g>
        <!-- Category labels -->
        <template v-if="showXAxis">
          <text
            v-for="p in points.filter((q) => showCat[q.index])" :key="`c-${p.index}`"
            :x="horizontal ? plot.x0 - 12 : catCenter(p.index)"
            :y="horizontal ? catCenter(p.index) : plot.y1 + 20"
            :text-anchor="horizontal ? 'end' : 'middle'"
            :dominant-baseline="horizontal ? 'central' : undefined"
            class="text-[11px] transition-colors"
            :class="focused === p.index ? 'fill-ousi-foreground' : 'fill-ousi-muted'"
          >{{ p.category }}</text>
        </template>
      </g>

      <!-- Tracks -->
      <g v-if="track">
        <rect
          v-for="(b, i) in bars" :key="`t-${i}`"
          :x="b.track.x" :y="b.track.y" :width="b.track.w" :height="b.track.h" :rx="Math.min(barRadius, (horizontal ? b.track.h : b.track.w) / 2)"
          :fill="trackColor"
        />
      </g>

      <!-- Bars -->
      <template v-for="(b, i) in bars" :key="`b-${i}`">
        <g v-if="stacked" :clip-path="`url(#${uid}-c${i})`" :style="{ opacity: dim && focused != null && focused !== i ? 0.35 : 1, filter: focused === i ? 'brightness(0.88)' : 'none', ...growStyle(i), transition: motion ? `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 40}ms, filter 200ms, opacity 200ms` : 'filter 200ms, opacity 200ms' }">
          <rect
            v-for="s in b.segs" :key="s.key"
            :x="s.x" :y="s.y" :width="s.w" :height="s.h" :fill="s.color"
            stroke="var(--ousi-background)" stroke-width="1.5"
          />
        </g>
        <template v-else>
          <rect
            v-for="(s, k) in b.segs" :key="s.key"
            :x="s.x" :y="s.y" :width="s.w" :height="s.h"
            :rx="Math.min(barRadius, (horizontal ? s.h : s.w) / 2)"
            :fill="s.color"
            :style="{ opacity: dim && focused != null && focused !== i ? 0.35 : 1, filter: focused === i ? 'brightness(0.88)' : 'none', ...growStyle(i, k) }"
          />
        </template>
      </template>

      <!-- Ring around the hovered category -->
      <rect
        v-if="outline && ring"
        class="pointer-events-none"
        :x="ring.x" :y="ring.y" :width="ring.w" :height="ring.h" :rx="ring.rx"
        fill="none" stroke="color-mix(in srgb, var(--ousi-foreground) 20%, transparent)" stroke-width="2"
        :style="{
          opacity: focused != null ? 1 : 0,
          transition: motion ? 'opacity 220ms ease-out, x 240ms cubic-bezier(0.22, 1, 0.36, 1), y 240ms cubic-bezier(0.22, 1, 0.36, 1), width 240ms, height 240ms' : 'opacity 150ms',
        }"
      />

      <!-- Hit areas -->
      <g v-if="interactive">
        <rect
          v-for="p in points" :key="`h-${p.index}`"
          :x="horizontal ? plot.x0 : catStart + p.index * band" :y="horizontal ? catStart + p.index * band : plot.y0"
          :width="horizontal ? plot.x1 - plot.x0 : band" :height="horizontal ? band : plot.y1 - plot.y0 + (showXAxis ? 24 : 8)"
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
          <span class="flex items-center gap-1.5 text-ousi-muted"><span class="inline-block size-2 rounded-sm" :style="{ backgroundColor: v.color }" />{{ v.label }}</span>
          <span class="font-medium tabular-nums text-ousi-foreground">{{ v.formatted }}</span>
        </div>
        <div v-if="stacked && focusedPoint.values.length > 1" class="mt-1.5 flex justify-between gap-4 border-t border-ousi-border pt-1.5 text-ousi-muted">
          <span>Total</span><span class="font-semibold tabular-nums text-ousi-foreground">{{ focusedPoint.formattedTotal }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>
