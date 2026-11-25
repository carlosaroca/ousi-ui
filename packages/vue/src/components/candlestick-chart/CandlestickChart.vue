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
import type { CandleItem, CandlestickChartProps, CandlestickChartSlots } from './candlestick-chart.types'

const props = withDefaults(defineProps<CandlestickChartProps>(), {
  height: 320,
  upColor: 'success',
  downColor: 'danger',
  barRadius: 3,
  barGap: 0.35,
  maxBarWidth: 24,
  showVolume: false,
  grid: true,
  showXAxis: true,
  showYAxis: true,
  interactive: true,
  tooltip: true,
  animated: true,
})
const emit = defineEmits<{
  'update:focused': [index: number | null]
  'candle-enter': [candle: CandleItem, event: Event]
  'candle-leave': [candle: CandleItem, event: Event]
  'candle-click': [candle: CandleItem, event: Event]
}>()
defineSlots<CandlestickChartSlots>()

const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => items.value.length)
const root = ref<HTMLElement | null>(null)
const width = useElementWidth(root)
const { mounted, motion } = useChartMotion(() => props.animated)

const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()
const fmtVolume = (n: number) =>
  props.formatVolume?.(n) ?? n.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 1 })
const words = computed(() => ({ open: 'Open', high: 'High', low: 'Low', close: 'Close', volume: 'Volume', ...props.labels }))

const items = computed<CandleItem[]>(() =>
  // A period with a price missing has no candle.
  props.data
    .filter((d) => [d.open, d.high, d.low, d.close].every(Number.isFinite))
    .map((d, index) => {
      // High and low take in the open and the close, even if the data disagrees with itself.
      const high = Math.max(d.high, d.open, d.close)
      const low = Math.min(d.low, d.open, d.close)
      const rising = d.close >= d.open
      const change = Number((d.close - d.open).toPrecision(12))
      return {
        key: d.id ?? d.label,
        index,
        label: d.label,
        open: d.open,
        high,
        low,
        close: d.close,
        volume: d.volume,
        rising,
        change,
        changePercent: d.open ? Math.round((change / Math.abs(d.open)) * 10000) / 100 : 0,
        color: resolveChartColor(rising ? props.upColor : props.downColor, index),
        formatted: {
          open: fmt(d.open),
          high: fmt(high),
          low: fmt(low),
          close: fmt(d.close),
          volume: d.volume === undefined ? undefined : fmtVolume(d.volume),
        },
      }
    }),
)

/* ── Scales ────────────────────────────────────────────────────── */

// Prices are read by how they move, so the axis fits them and does not start at zero.
const domain = computed(() => {
  if (!items.value.length) return niceDomain(0, 1)
  return niceDomain(Math.min(...items.value.map((c) => c.low)), Math.max(...items.value.map((c) => c.high)))
})
const ticks = computed(() =>
  Array.from({ length: 5 }, (_, i) => Number((domain.value.lo + domain.value.step * i).toPrecision(12))),
)
const topVolume = computed(() => Math.max(0, ...items.value.map((c) => c.volume ?? 0)))
const hasVolume = computed(() => props.showVolume && topVolume.value > 0)

const pad = computed(() => ({ top: 8, right: 8, bottom: props.showXAxis ? 30 : 8, left: props.showYAxis ? 56 : 8 }))
const plot = computed(() => ({
  x0: pad.value.left,
  x1: Math.max(width.value - pad.value.right, pad.value.left + 1),
  y0: pad.value.top,
  y1: Math.max(props.height - pad.value.bottom, pad.value.top + 1),
}))
/** Volume takes the bottom fifth, and the prices what is above it. */
const volumeHeight = computed(() => (hasVolume.value ? (plot.value.y1 - plot.value.y0) * 0.2 : 0))
const priceBottom = computed(() => plot.value.y1 - (hasVolume.value ? volumeHeight.value + 10 : 0))
const y = (value: number) => {
  const { lo, hi } = domain.value
  return priceBottom.value - ((value - lo) / (hi - lo || 1)) * (priceBottom.value - plot.value.y0)
}
const band = computed(() => (plot.value.x1 - plot.value.x0) / Math.max(items.value.length, 1))
const bodyWidth = computed(() =>
  Math.max(Math.min(band.value * (1 - Math.min(Math.max(props.barGap, 0), 0.9)), props.maxBarWidth), 1),
)
const wickWidth = computed(() => Math.min(Math.max(bodyWidth.value * 0.14, 1), 2))
const center = (i: number) => plot.value.x0 + band.value * (i + 0.5)

const candles = computed(() =>
  items.value.map((c) => {
    const from = y(Math.max(c.open, c.close))
    // A period that closed where it opened is still a line.
    const height = Math.max(y(Math.min(c.open, c.close)) - from, 1.5)
    const volume = hasVolume.value && c.volume ? Math.max((c.volume / topVolume.value) * volumeHeight.value, 2) : 0
    return {
      x: center(c.index),
      top: y(c.high),
      bottom: y(c.low),
      body: { x: center(c.index) - bodyWidth.value / 2, y: from, width: bodyWidth.value, height, rx: Math.max(Math.min(props.barRadius, bodyWidth.value / 2, height / 2), 0) },
      volume,
    }
  }),
)

const showCategory = computed(() => visibleLabels(items.value.map((c) => c.label), items.value.map((c) => center(c.index))))

/* ── Interaction ───────────────────────────────────────────────── */

function enter(candle: CandleItem, e: Event) {
  if (!props.interactive) return
  setFocused(candle.index)
  emit('candle-enter', candle, e)
}
function leave(candle: CandleItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('candle-leave', candle, e)
}
function click(candle: CandleItem, e: Event) {
  if (props.interactive) emit('candle-click', candle, e)
}

const focusedCandle = computed(() => (focused.value == null ? null : (items.value[focused.value] ?? null)))
// Beside the candle, on whichever side has room, so it does not cover what is being read.
const tooltipStyle = computed(() => {
  const c = focusedCandle.value
  if (!c) return {}
  const x = center(c.index)
  const left = x > width.value / 2
  return { left: `${left ? x - 12 : x + 12}px`, top: `${pad.value.top}px`, transform: left ? 'translateX(-100%)' : 'none' }
})
const percent = (c: CandleItem) => `${c.change > 0 ? '+' : ''}${c.changePercent}%`

const describe = (c: CandleItem) =>
  `${c.label}: ${words.value.open} ${c.formatted.open}, ${words.value.high} ${c.formatted.high}, ${words.value.low} ${c.formatted.low}, ${words.value.close} ${c.formatted.close}, ${percent(c)}`
const ariaLabel = computed(() => {
  if (props.label) return props.label
  const [first, last] = [items.value[0], items.value.at(-1)]
  if (!first || !last) return 'Candlestick chart, no data'
  return `Candlestick chart, ${items.value.length} periods from ${first.label} to ${last.label}`
})
</script>

<template>
  <div ref="root" data-roving-root :class="cn('relative w-full min-w-0 max-w-full select-none', props.class)" :style="{ height: `${height}px` }">
    <svg width="100%" :height="height" class="block overflow-visible" role="group" :aria-label="ariaLabel">
      <g aria-hidden="true">
        <template v-for="t in ticks" :key="t">
          <line v-if="grid" data-part="grid" :x1="plot.x0" :x2="plot.x1" :y1="y(t)" :y2="y(t)" :stroke="chartGridColor" />
          <text v-if="showYAxis" :x="plot.x0 - 10" :y="y(t)" text-anchor="end" dominant-baseline="central" class="fill-ousi-muted text-[11px] tabular-nums">{{ fmt(t) }}</text>
        </template>
        <template v-if="showXAxis">
          <text
            v-for="c in items.filter((i) => showCategory[i.index])"
            :key="c.key"
            :x="center(c.index)"
            :y="plot.y1 + 20"
            text-anchor="middle"
            class="text-[11px] transition-colors"
            :class="focused === c.index ? 'fill-ousi-foreground' : 'fill-ousi-muted'"
          >{{ c.label }}</text>
        </template>
        <!-- A guide down the hovered period. -->
        <line
          v-if="focusedCandle"
          data-part="guide"
          :x1="center(focusedCandle.index)"
          :x2="center(focusedCandle.index)"
          :y1="plot.y0"
          :y2="plot.y1"
          stroke="var(--ousi-muted)"
          stroke-width="1"
          stroke-dasharray="3 3"
        />
      </g>

      <g aria-hidden="true">
        <g
          v-for="(c, i) in candles"
          :key="items[i].key"
          data-part="candle"
          :data-rising="items[i].rising"
          :style="{
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transform: mounted ? 'scaleY(1)' : 'scaleY(0)',
            transition: motion ? `transform 500ms cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(i * 12, 600)}ms` : 'none',
          }"
        >
          <line data-part="wick" :x1="c.x" :x2="c.x" :y1="c.top" :y2="c.bottom" :stroke="items[i].color" :stroke-width="wickWidth" stroke-linecap="round" />
          <rect data-part="body" v-bind="c.body" :fill="items[i].color" />
        </g>
        <template v-if="hasVolume">
          <template v-for="(c, i) in candles" :key="`v-${items[i].key}`">
            <rect
              v-if="c.volume"
              data-part="volume"
              :x="c.body.x"
              :y="plot.y1 - c.volume"
              :width="c.body.width"
              :height="c.volume"
              :rx="Math.min(barRadius, c.body.width / 2, c.volume / 2)"
              :fill="items[i].color"
              :style="{ opacity: focused === i ? 0.7 : 0.3, transition: 'opacity 150ms' }"
            />
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
          :height="plot.y1 - plot.y0"
          fill="transparent"
          class="cursor-crosshair outline-none focus-visible:stroke-ousi-focus focus-visible:stroke-2"
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

    <div v-if="tooltip && focusedCandle" data-part="tooltip" :class="chartTooltipClass" :style="tooltipStyle">
      <slot name="tooltip" :candle="focusedCandle">
        <div class="mb-1.5 flex items-center justify-between gap-4">
          <span class="font-medium text-ousi-foreground">{{ focusedCandle.label }}</span>
          <span class="font-semibold tabular-nums" :class="focusedCandle.rising ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">{{ percent(focusedCandle) }}</span>
        </div>
        <div v-for="key in (['open', 'high', 'low', 'close'] as const)" :key="key" class="mt-1 flex justify-between gap-6">
          <span class="text-ousi-muted">{{ words[key] }}</span>
          <span class="font-medium tabular-nums text-ousi-foreground">{{ focusedCandle.formatted[key] }}</span>
        </div>
        <div v-if="focusedCandle.formatted.volume !== undefined" class="mt-1.5 flex justify-between gap-6 border-t border-ousi-border pt-1.5">
          <span class="text-ousi-muted">{{ words.volume }}</span>
          <span class="font-medium tabular-nums text-ousi-foreground">{{ focusedCandle.formatted.volume }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>
