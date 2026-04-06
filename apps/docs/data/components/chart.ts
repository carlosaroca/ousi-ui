import type { ComponentData } from './types'

export const chartData: ComponentData = {
  title: 'Chart',
  description: 'Real-time animated line chart, canvas-rendered at 60fps. Zero charting library dependencies.',
  category: 'Data Display',
  importCode: "import { OChart } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ChartBasic',
        code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OChart } from '@ousi-ui/vue'
import type { ChartPoint } from '@ousi-ui/vue'

const data = ref<ChartPoint[]>([])
const value = ref(100)
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  const now = Date.now() / 1000
  let v = 100
  const pts: ChartPoint[] = []
  for (let i = 60; i >= 0; i--) {
    v += (Math.random() - 0.5) * 0.4
    pts.push({ time: now - i, value: v })
  }
  data.value = pts
  value.value = v

  interval = setInterval(() => {
    value.value += (Math.random() - 0.5) * 0.3
    data.value = [
      ...data.value.slice(-120),
      { time: Date.now() / 1000, value: value.value },
    ]
  }, 500)
})
onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="h-64 w-full">
    <OChart :data="data" :value="value" color="#3b82f6" />
  </div>
</template>`,
      },
    },
    {
      id: 'momentum',
      title: 'Momentum',
      example: {
        component: 'ChartMomentum',
        code: `<!-- Auto-detect momentum from recent data -->
<OChart
  :data="data"
  :value="value"
  :momentum="true"
  badge
/>

<!-- Override momentum direction -->
<OChart :data="data" :value="value" momentum="up" />
<OChart :data="data" :value="value" momentum="down" />

<!-- Degen mode — particles + shake on swings -->
<OChart :data="data" :value="value" :degen="true" exaggerate />`,
      },
    },
    {
      id: 'value-overlay',
      title: 'Value overlay',
      example: {
        component: 'ChartShowValue',
        code: `<OChart
  :data="data"
  :value="value"
  show-value
  value-momentum-color
  :format-value="(v) => \`$\${v.toFixed(2)}\`"
/>`,
      },
    },
    {
      id: 'time-windows',
      title: 'Time windows',
      example: {
        component: 'ChartWindows',
        code: `<OChart
  :data="data"
  :value="value"
  color="#8b5cf6"
  :windows="[
    { label: '30s', secs: 30 },
    { label: '1m', secs: 60 },
    { label: '5m', secs: 300 },
  ]"
  window-style="rounded"
  @window-change="(secs) => console.log('Window:', secs)"
/>`,
      },
    },
    {
      id: 'reference-line',
      title: 'Reference line',
      example: {
        component: 'ChartReference',
        code: `<!-- With label (gap in the middle) -->
<OChart
  :data="data"
  :value="value"
  color="#22c55e"
  :reference-line="{ value: 100, label: 'Target' }"
  :fill="false"
/>

<!-- Without label (dashed line) -->
<OChart
  :data="data"
  :value="value"
  :reference-line="{ value: 100 }"
/>`,
      },
    },
    {
      id: 'orderbook',
      title: 'Orderbook',
      example: {
        component: 'ChartOrderbook',
        code: `<OChart
  :data="data"
  :value="value"
  :orderbook="{
    bids: [[99.9, 25], [99.8, 40], [99.7, 15]],
    asks: [[100.1, 30], [100.2, 20], [100.3, 35]],
  }"
  :padding="{ top: 12, right: 80, bottom: 28, left: 120 }"
/>`,
      },
    },
    {
      id: 'candlestick',
      title: 'Candlestick',
      example: {
        component: 'ChartCandlestick',
        code: `<OChart
  :data="[]"
  :value="0"
  mode="candle"
  :candles="candles"
  :candle-width="10"
  :live-candle="liveCandle"
  color="#f59e0b"
  :badge="false"
/>`,
      },
    },
    {
      id: 'multi-series',
      title: 'Multi-series',
      example: {
        component: 'ChartMultiSeries',
        code: `<OChart
  :data="[]"
  :value="0"
  :series="[
    { id: 'btc', data: btcData, value: btcValue, color: '#f59e0b', label: 'BTC' },
    { id: 'eth', data: ethData, value: ethValue, color: '#3b82f6', label: 'ETH' },
    { id: 'sol', data: solData, value: solValue, color: '#8b5cf6', label: 'SOL' },
  ]"
  :fill="false"
  :badge="false"
/>`,
      },
    },
    {
      id: 'states',
      title: 'States',
      example: {
        component: 'ChartStates',
        code: `<!-- Empty state: breathing squiggly line -->
<OChart :data="[]" :value="0" />

<!-- Loading → data transition: center-out morph -->
<OChart :data="data" :value="value" />

<!-- The chart animates between states automatically -->`,
      },
    },
    {
      id: 'theming',
      title: 'Theming',
      example: {
        component: 'ChartTheming',
        code: `<!-- Dark theme (default) -->
<OChart :data="data" :value="value" theme="dark" color="#3b82f6" />

<!-- Light theme -->
<OChart :data="data" :value="value" theme="light" color="#22c55e" />

<!-- The palette is derived from the accent color automatically:
     line, fill gradient, grid, crosshair, badge, dot — all adapt. -->`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'ChartPoint[]', description: 'Array of { time, value } points. Time in unix seconds.' },
    { name: 'value', type: 'number', description: 'Current live value — smoothly lerped to the tip of the line.' },
    { name: 'theme', type: "'light' | 'dark'", default: "'dark'", description: 'Color scheme for the chart palette.' },
    { name: 'color', type: 'string', default: "'#3b82f6'", description: 'Accent color for the line, fill, dot, and badge.' },
    { name: 'series', type: 'ChartSeries[]', default: '-', description: 'Multi-series mode — array of { id, data, value, color, label }. Overrides data/value/color.' },
    { name: 'mode', type: "'line' | 'candle'", default: "'line'", description: 'Chart type — line or candlestick.' },
    { name: 'candles', type: 'CandlePoint[]', default: '-', description: 'OHLC candle data (required when mode="candle").' },
    { name: 'candleWidth', type: 'number', default: '-', description: 'Seconds per candle (required when mode="candle").' },
    { name: 'liveCandle', type: 'CandlePoint', default: '-', description: 'Current live candle with real-time OHLC updates.' },
    { name: 'grid', type: 'boolean', default: 'true', description: 'Show Y-axis grid lines and labels.' },
    { name: 'badge', type: 'boolean', default: 'true', description: 'Show the live value badge at the right edge.' },
    { name: 'badgeVariant', type: "'default' | 'minimal'", default: "'default'", description: 'Badge visual style.' },
    { name: 'badgeTail', type: 'boolean', default: 'true', description: 'Show the pointed tail on the badge pill.' },
    { name: 'fill', type: 'boolean', default: 'true', description: 'Show gradient fill under the line.' },
    { name: 'pulse', type: 'boolean', default: 'true', description: 'Pulsing ring animation on the live dot.' },
    { name: 'momentum', type: "boolean | 'up' | 'down' | 'flat'", default: 'true', description: 'Auto-detect or override momentum direction. Shows chevron arrows.' },
    { name: 'scrub', type: 'boolean', default: 'true', description: 'Enable crosshair scrubbing on hover/touch.' },
    { name: 'exaggerate', type: 'boolean', default: 'false', description: 'Tight Y-axis range — small moves fill chart height.' },
    { name: 'showValue', type: 'boolean', default: 'false', description: 'Show live value as a DOM text overlay.' },
    { name: 'valueMomentumColor', type: 'boolean', default: 'false', description: 'Color the value text green/red by momentum.' },
    { name: 'degen', type: 'boolean | ChartDegenOptions', default: 'false', description: 'Degen mode — particle bursts + shake on momentum swings.' },
    { name: 'window', type: 'number', default: '30', description: 'Visible time window in seconds.' },
    { name: 'windows', type: 'ChartWindowOption[]', default: '-', description: 'Array of { label, secs } for time window buttons.' },
    { name: 'windowStyle', type: "'default' | 'rounded' | 'text'", default: "'default'", description: 'Style of the time window buttons.' },
    { name: 'tooltipY', type: 'number', default: '14', description: 'Vertical offset for the crosshair tooltip text.' },
    { name: 'tooltipOutline', type: 'boolean', default: 'true', description: 'Stroke outline on crosshair text for readability.' },
    { name: 'orderbook', type: 'ChartOrderbookData', default: '-', description: 'Orderbook data for streaming bid/ask labels.' },
    { name: 'referenceLine', type: 'ChartReferenceLine', default: '-', description: 'Horizontal reference line with optional label.' },
    { name: 'formatValue', type: '(v: number) => string', default: 'v.toFixed(2)', description: 'Custom value formatter.' },
    { name: 'formatTime', type: '(t: number) => string', default: 'HH:MM:SS', description: 'Custom time formatter.' },
    { name: 'lerpSpeed', type: 'number', default: '0.08', description: 'Animation lerp speed (0\u20131). Higher = faster.' },
    { name: 'padding', type: 'ChartPadding', default: '{ top: 12, right: 80, bottom: 28, left: 12 }', description: 'Canvas padding in pixels.' },
    { name: 'cursor', type: 'string', default: "'crosshair'", description: 'CSS cursor on hover.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the container.' },
  ],

  emits: [
    { name: 'window-change', type: '(secs: number) => void', description: 'Emitted when the user clicks a time window button.' },
    { name: 'hover', type: '(point: ChartPoint & { x, y } | null) => void', description: 'Emitted on crosshair hover with interpolated point, or null on leave.' },
  ],

  keyboard: [
    { key: 'escape', description: 'Clears the crosshair scrub state.' },
  ],

  bestPractices: [
    { text: 'Always provide `data` and `value` — `data` is the historical series, `value` is the live tip.', good: true },
    { text: 'Use unix seconds (not milliseconds) for `time` in `ChartPoint`.', good: true },
    { text: 'Give the container a fixed height — the chart fills 100% of its parent.', good: true },
    { text: 'Use `exaggerate` for financial data where small movements matter.', good: true },
    { text: 'Don\'t pass thousands of data points — trim to ~2x the visible window.', good: true },
    { text: 'Don\'t use `degen` mode in production dashboards.', good: false },
  ],
}
