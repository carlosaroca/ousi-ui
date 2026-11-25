<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@ousi-ui/core'
import {
  chartGridColor,
  chartTooltipClass,
  resolveChartColor,
  useChartMotion,
  useElementWidth,
  useFocus,
  useRoving,
  visibleLabels,
} from '../chart-shared'
import { niceDomain } from '../combo-chart/combo-chart.utils'
import { runWaterfall } from './waterfall-chart.utils'
import type { WaterfallBar, WaterfallChartProps, WaterfallChartSlots } from './waterfall-chart.types'

const props = withDefaults(defineProps<WaterfallChartProps>(), {
  height: 280,
  barRadius: 8,
  barGap: 0.35,
  increaseColor: 'success',
  decreaseColor: 'danger',
  totalColor: 'accent',
  connectors: true,
  showValues: true,
  grid: true,
  showXAxis: true,
  showYAxis: true,
  totalLabel: 'Total',
  interactive: true,
  tooltip: true,
  animated: true,
})
const emit = defineEmits<{
  'update:focused': [index: number | null]
  'bar-enter': [bar: WaterfallBar, event: Event]
  'bar-leave': [bar: WaterfallBar, event: Event]
  'bar-click': [bar: WaterfallBar, event: Event]
}>()
defineSlots<WaterfallChartSlots>()

const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.data.length)
const root = ref<HTMLElement | null>(null)
const width = useElementWidth(root)
const { mounted, motion } = useChartMotion(() => props.animated)

const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()
const signed = (n: number) => (n > 0 ? `+${fmt(n)}` : fmt(n))

const items = computed<WaterfallBar[]>(() => {
  const colors = { increase: props.increaseColor, decrease: props.decreaseColor, total: props.totalColor }
  return runWaterfall(props.data).map((step, index) => {
    const datum = props.data[index]
    return {
      ...step,
      key: datum.id ?? datum.label,
      index,
      label: datum.label,
      color: resolveChartColor(datum.color ?? colors[step.kind], index),
      formatted: step.kind === 'total' ? fmt(step.value) : signed(step.value),
      formattedEnd: fmt(step.end),
    }
  })
})

/* ── Scales ────────────────────────────────────────────────────── */

const domain = computed(() => {
  const levels = items.value.flatMap((b) => [b.start, b.end])
  const low = Math.min(0, ...levels)
  return niceDomain(low, Math.max(0, ...levels, low + 1), 4, low < 0 ? undefined : 0)
})
const ticks = computed(() =>
  Array.from({ length: 5 }, (_, i) => Number((domain.value.lo + domain.value.step * i).toPrecision(12))),
)

const pad = computed(() => ({
  top: props.showValues ? 24 : 12,
  right: 12,
  bottom: props.showXAxis ? 30 : 8,
  left: props.showYAxis ? 52 : 12,
}))
const plot = computed(() => ({
  x0: pad.value.left,
  x1: Math.max(width.value - pad.value.right, pad.value.left + 1),
  y0: pad.value.top,
  y1: Math.max(props.height - pad.value.bottom, pad.value.top + 1),
}))
const y = (value: number) => {
  const { lo, hi } = domain.value
  return plot.value.y1 - ((value - lo) / (hi - lo || 1)) * (plot.value.y1 - plot.value.y0)
}
const band = computed(() => (plot.value.x1 - plot.value.x0) / Math.max(items.value.length, 1))
const barWidth = computed(() => band.value * (1 - Math.min(Math.max(props.barGap, 0), 0.9)))
const center = (i: number) => plot.value.x0 + band.value * (i + 0.5)

/** A change other than zero is always seen, however small next to the totals. */
const SHORTEST = 3

const bars = computed(() =>
  items.value.map((item) => {
    const rises = item.end >= item.start
    let height = Math.abs(y(item.start) - y(item.end))
    if (item.value !== 0) height = Math.max(height, SHORTEST)
    // It grows from the level it starts at: upwards from there, or downwards.
    const top = rises ? y(item.start) - height : y(item.start)
    const w = barWidth.value
    return {
      x: center(item.index) - w / 2,
      y: top,
      width: w,
      height,
      rx: Math.max(Math.min(props.barRadius, w / 2, height / 2), 0),
      rises,
    }
  }),
)

// Behind the bars, from under one to under the next, so the rounded corners leave no gap.
const links = computed(() =>
  items.value.slice(0, -1).map((item, i) => ({
    key: item.key,
    level: y(item.end),
    from: bars.value[i].x + bars.value[i].width - bars.value[i].rx,
    to: bars.value[i + 1].x + bars.value[i + 1].rx,
  })),
)

const showCategory = computed(() => visibleLabels(items.value.map((b) => b.label), items.value.map((b) => center(b.index))))
/** A value is written only where it fits its slot. */
const fits = (text: string) => text.length * 6.4 <= band.value + 2

/* ── Interaction ───────────────────────────────────────────────── */

function enter(bar: WaterfallBar, e: Event) {
  if (!props.interactive) return
  setFocused(bar.index)
  emit('bar-enter', bar, e)
}
function leave(bar: WaterfallBar, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('bar-leave', bar, e)
}
function click(bar: WaterfallBar, e: Event) {
  if (props.interactive) emit('bar-click', bar, e)
}

const focusedBar = computed(() => (focused.value == null ? null : (items.value[focused.value] ?? null)))
const tooltipStyle = computed(() => {
  const bar = focusedBar.value
  if (!bar) return {}
  const x = center(bar.index)
  const align = x < 90 ? '0%' : x > width.value - 90 ? '-100%' : '-50%'
  return { left: `${x}px`, top: `${pad.value.top - 4}px`, transform: `translateX(${align})` }
})

const describe = (bar: WaterfallBar) =>
  bar.kind === 'total' ? `${bar.label}: ${bar.formatted}` : `${bar.label}: ${bar.formatted}, ${props.totalLabel} ${bar.formattedEnd}`
const ariaLabel = computed(() => props.label ?? `Waterfall chart. ${items.value.map(describe).join('. ')}`)
</script>

<template>
  <div ref="root" data-roving-root :class="cn('relative w-full min-w-0 max-w-full select-none', props.class)" :style="{ height: `${height}px` }">
    <svg width="100%" :height="height" class="block overflow-visible" role="group" :aria-label="ariaLabel">
      <g aria-hidden="true">
        <template v-for="t in ticks" :key="t">
          <line v-if="grid" data-part="grid" :x1="plot.x0" :x2="plot.x1" :y1="y(t)" :y2="y(t)" :stroke="chartGridColor" />
          <text v-if="showYAxis" :x="plot.x0 - 10" :y="y(t)" text-anchor="end" dominant-baseline="central" class="fill-ousi-muted text-[11px] tabular-nums">{{ fmt(t) }}</text>
        </template>
        <!-- With values below zero, where zero is has to be plain. -->
        <line v-if="domain.lo < 0" data-part="zero" :x1="plot.x0" :x2="plot.x1" :y1="y(0)" :y2="y(0)" stroke="var(--ousi-muted)" stroke-width="1" />
        <template v-if="showXAxis">
          <text
            v-for="b in items.filter((i) => showCategory[i.index])"
            :key="b.key"
            :x="center(b.index)"
            :y="plot.y1 + 20"
            text-anchor="middle"
            class="text-[11px] transition-colors"
            :class="focused === b.index ? 'fill-ousi-foreground' : 'fill-ousi-muted'"
          >{{ b.label }}</text>
        </template>
      </g>

      <g v-if="connectors" aria-hidden="true">
        <line
          v-for="l in links"
          :key="l.key"
          data-part="connector"
          :x1="l.from"
          :x2="l.to"
          :y1="l.level"
          :y2="l.level"
          stroke="var(--ousi-muted)"
          stroke-width="1"
          stroke-dasharray="3 3"
          :style="{ opacity: mounted ? 0.6 : 0, transition: motion ? 'opacity 400ms ease-out 500ms' : 'none' }"
        />
      </g>

      <g aria-hidden="true">
        <rect
          v-for="(b, i) in bars"
          :key="items[i].key"
          data-part="bar"
          :data-kind="items[i].kind"
          :x="b.x"
          :y="b.y"
          :width="b.width"
          :height="b.height"
          :rx="b.rx"
          :fill="items[i].color"
          :style="{
            transformBox: 'fill-box',
            transformOrigin: b.rises ? 'center bottom' : 'center top',
            transform: mounted ? 'scaleY(1)' : 'scaleY(0)',
            filter: focused === i ? 'brightness(0.9)' : 'none',
            opacity: focused != null && focused !== i ? 0.45 : 1,
            transition: motion ? `transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(i * 70, 700)}ms, opacity 200ms, filter 200ms` : 'opacity 200ms, filter 200ms',
          }"
        />
        <template v-if="showValues">
          <template v-for="(b, i) in bars" :key="`v-${items[i].key}`">
            <text
              v-if="fits(items[i].formatted)"
              data-part="value"
              :x="center(i)"
              :y="b.y - 7"
              text-anchor="middle"
              class="fill-ousi-foreground text-[11px] font-medium tabular-nums"
              :style="{ opacity: mounted ? 1 : 0, transition: motion ? `opacity 300ms ease-out ${Math.min(i * 70, 700) + 350}ms` : 'none' }"
            >{{ items[i].formatted }}</text>
          </template>
        </template>
      </g>

      <g v-if="interactive">
        <rect
          v-for="item in items"
          :key="`h-${item.key}`"
          data-part="hit"
          :x="plot.x0 + item.index * band"
          :y="plot.y0"
          :width="band"
          :height="plot.y1 - plot.y0 + (showXAxis ? 24 : 8)"
          fill="transparent"
          class="cursor-pointer outline-none focus-visible:stroke-ousi-focus focus-visible:stroke-2"
          role="img"
          :tabindex="roving.tabindexFor(item.index, true)"
          :data-roving="item.index"
          :aria-label="describe(item)"
          @focusin="roving.activate(item.index)"
          @keydown="roving.onKeydown($event, item.index)"
          @mouseenter="enter(item, $event)"
          @mouseleave="leave(item, $event)"
          @focus="enter(item, $event)"
          @blur="leave(item, $event)"
          @click="click(item, $event)"
          @keydown.enter.prevent="click(item, $event)"
          @keydown.space.prevent="click(item, $event)"
        />
      </g>
    </svg>

    <div v-if="tooltip && focusedBar" data-part="tooltip" :class="chartTooltipClass" :style="tooltipStyle">
      <slot name="tooltip" :bar="focusedBar">
        <div class="mb-1.5 font-medium text-ousi-foreground">{{ focusedBar.label }}</div>
        <div class="flex items-center gap-1.5">
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: focusedBar.color }" />
          <span class="font-medium tabular-nums text-ousi-foreground">{{ focusedBar.formatted }}</span>
        </div>
        <div v-if="focusedBar.kind !== 'total'" class="mt-1.5 flex justify-between gap-4 border-t border-ousi-border pt-1.5 text-ousi-muted">
          <span>{{ totalLabel }}</span><span class="font-semibold tabular-nums text-ousi-foreground">{{ focusedBar.formattedEnd }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>
