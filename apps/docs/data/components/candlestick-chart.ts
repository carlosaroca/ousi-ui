import type { ComponentData } from './types'

export const candlestickChartData: ComponentData = {
  title: 'Candlestick Chart',
  description: 'Open, high, low and close of each period, with volume if you want it.',
  category: 'Charts',
  importCode: 'import { OCandlestickChart } from \'@ousi-ui/vue\'',

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'CandlestickChartBasic',
        code: `<script setup lang="ts">
import { OCandlestickChart } from '@ousi-ui/vue'

function prices(count: number, start: number, seed: number) {
  let last = start
  let state = seed
  const random = () => ((state = (state * 48271) % 2147483647) / 2147483647)
  return Array.from({ length: count }, (_, i) => {
    const open = last
    const close = Math.round((open + (random() - 0.46) * 9) * 100) / 100
    last = close
    return {
      label: \`\${i + 1} Jun\`,
      open,
      high: Math.round((Math.max(open, close) + random() * 4) * 100) / 100,
      low: Math.round((Math.min(open, close) - random() * 4) * 100) / 100,
      close,
      volume: Math.round(40000 + random() * 160000),
    }
  })
}

const data = prices(24, 142, 7)
</script>
<template>
  <OCandlestickChart :data="data" :height="300" :format-value="(v) => \`$\${v.toFixed(2)}\`" />
</template>`,
      },
    },
    {
      id: 'volume',
      title: 'Volume and ranges',
      example: {
        component: 'CandlestickChartCard',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCandlestickChart, OCard, OTabs } from '@ousi-ui/vue'

function prices(count: number, start: number, seed: number) {
  let last = start
  let state = seed
  const random = () => ((state = (state * 48271) % 2147483647) / 2147483647)
  return Array.from({ length: count }, (_, i) => {
    const open = last
    const close = Math.round((open + (random() - 0.46) * 9) * 100) / 100
    last = close
    return {
      label: \`\${i + 1} Jun\`,
      open,
      high: Math.round((Math.max(open, close) + random() * 4) * 100) / 100,
      low: Math.round((Math.min(open, close) - random() * 4) * 100) / 100,
      close,
      volume: Math.round(40000 + random() * 160000),
    }
  })
}

const month = prices(30, 188, 21)
const range = ref('30')
const ranges = [{ key: '10', label: '10D' }, { key: '20', label: '20D' }, { key: '30', label: '30D' }]
const data = computed(() => month.slice(-Number(range.value)))

const focused = ref<number | null>(null)
const shown = computed(() => data.value[focused.value ?? data.value.length - 1])
const since = computed(() => ((shown.value.close - data.value[0].open) / data.value[0].open) * 100)
</script>
<template>
  <OCard class="w-full min-w-0 max-w-xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-xs font-medium text-ousi-muted">ACME · {{ shown.label }}</div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-semibold tabular-nums text-ousi-foreground">\${{ shown.close.toFixed(2) }}</span>
          <span class="text-sm font-medium tabular-nums" :class="since >= 0 ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
            {{ since >= 0 ? '+' : '' }}{{ since.toFixed(2) }}%
          </span>
        </div>
      </div>
      <OTabs v-model="range" :items="ranges" size="sm" />
    </div>
    <OCandlestickChart v-model:focused="focused" :data="data" :height="280" show-volume />
  </OCard>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'CandlestickChartVariants',
        code: `<script setup lang="ts">
import { OCandlestickChart } from '@ousi-ui/vue'

function prices(count: number, start: number, seed: number) {
  let last = start
  let state = seed
  const random = () => ((state = (state * 48271) % 2147483647) / 2147483647)
  return Array.from({ length: count }, (_, i) => {
    const open = last
    const close = Math.round((open + (random() - 0.46) * 9) * 100) / 100
    last = close
    return {
      label: \`\${i + 1} Jun\`,
      open,
      high: Math.round((Math.max(open, close) + random() * 4) * 100) / 100,
      low: Math.round((Math.min(open, close) - random() * 4) * 100) / 100,
      close,
      volume: Math.round(40000 + random() * 160000),
    }
  })
}

const few = prices(8, 64, 4)
const many = prices(90, 320, 11)
</script>
<template>
  <div class="grid w-full min-w-0 gap-8 md:grid-cols-2">
    <div class="min-w-0">
      <p class="mb-2 text-xs text-ousi-muted">few periods, rounder, own colours</p>
      <OCandlestickChart :data="few" :height="200" :bar-radius="12" :max-bar-width="18" up-color="accent" down-color="orange" />
    </div>
    <div class="min-w-0">
      <p class="mb-2 text-xs text-ousi-muted">90 periods, no grid, no axes</p>
      <OCandlestickChart :data="many" :height="200" :grid="false" :show-x-axis="false" :show-y-axis="false" />
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'CandleDatum[]', default: '-', description: 'Each: { id?, label, open, high, low, close, volume? }. A period with a price missing is left out.' },
    { name: 'height', type: 'number', default: '320', description: 'Height in px. The width is fluid.' },
    { name: 'upColor', type: 'string', default: '\'success\'', description: 'Closed at or above its open.' },
    { name: 'downColor', type: 'string', default: '\'danger\'', description: 'Closed below it.' },
    { name: 'barRadius', type: 'number', default: '3', description: 'Corner radius of the bodies, in px.' },
    { name: 'barGap', type: 'number', default: '0.35', description: 'Space between candles as a share of each slot.' },
    { name: 'maxBarWidth', type: 'number', default: '24', description: 'The widest a body gets, in px.' },
    { name: 'showVolume', type: 'boolean', default: 'false', description: 'Bars of volume along the bottom.' },
    { name: 'formatVolume', type: '(value: number) => string', default: '-', description: 'Formats volumes. Compact by default.' },
    { name: 'labels', type: 'object', default: '-', description: 'Words for open, high, low, close and volume.' },
    { name: 'grid', type: 'boolean', default: 'true', description: 'Grid lines.' },
    { name: 'showXAxis', type: 'boolean', default: 'true', description: 'Labels along the bottom.' },
    { name: 'showYAxis', type: 'boolean', default: 'true', description: 'Values along the side.' },
    { name: 'formatValue', type: '(value: number) => string', default: '-', description: 'Formats values.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'The built-in tooltip, replaceable with its slot.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Hover, keyboard and click.' },
    { name: 'focused', type: 'number | null', default: 'null', description: 'The highlighted one. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animates in. Off with prefers-reduced-motion.' },
    { name: 'label', type: 'string', default: '-', description: 'Accessible name, instead of the one made from the data.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'tooltip', type: '{ candle }', description: 'Content of the tooltip.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted candle changed.' },
    { name: 'candle-enter', type: '(candle, event)', description: 'Pointer or focus enters a period.' },
    { name: 'candle-leave', type: '(candle, event)', description: 'And leaves it.' },
    { name: 'candle-click', type: '(candle, event)', description: 'A period was clicked.' },
  ],

  keyboard: [
    { key: 'left', description: 'Previous.' },
    { key: 'right', description: 'Next.' },
    { key: 'home', description: 'First.' },
    { key: 'end', description: 'Last.' },
    { key: 'enter', description: 'Emits the click.' },
  ],
}
