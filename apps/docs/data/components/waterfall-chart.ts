import type { ComponentData } from './types'

export const waterfallChartData: ComponentData = {
  title: 'Waterfall Chart',
  description: 'How a starting figure becomes a final one: each rise and fall floats where the one before left off.',
  category: 'Charts',
  importCode: 'import { OWaterfallChart } from \'@ousi-ui/vue\'',

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'WaterfallChartBasic',
        code: `<script setup lang="ts">
import { OWaterfallChart } from '@ousi-ui/vue'

const money = (v: number) => \`\${v < 0 ? '−' : ''}$\${Math.abs(v)}k\`

// How revenue becomes profit. A total with a value opens the account; without one, it adds up.
const data = [
  { label: 'Revenue', value: 420, total: true },
  { label: 'Cost of goods', value: -150 },
  { label: 'Gross', total: true },
  { label: 'Salaries', value: -110 },
  { label: 'Marketing', value: -45 },
  { label: 'Services', value: 38 },
  { label: 'Net', total: true },
]
</script>
<template>
  <OWaterfallChart :data="data" :height="300" :format-value="money" />
</template>`,
      },
    },
    {
      id: 'cash',
      title: 'Below zero, header follows hover',
      example: {
        component: 'WaterfallChartCash',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OWaterfallChart } from '@ousi-ui/vue'

const data = [
  { label: 'Open', value: 18, total: true },
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: -22 },
  { label: 'Mar', value: -17 },
  { label: 'Apr', value: 9 },
  { label: 'May', value: 26 },
  { label: 'Jun', value: 14 },
  { label: 'Close', total: true },
]
const money = (v: number) => \`\${v < 0 ? '−' : ''}$\${Math.abs(v)}k\`

// The header follows the hovered bar.
const focused = ref<number | null>(null)
const close = 18 + data.slice(1, -1).reduce((total, d) => total + (d.value ?? 0), 0)
const shown = computed(() => {
  if (focused.value == null) return { title: 'Cash at the end of June', value: close }
  const running = data.slice(0, focused.value + 1).reduce((total, d) => total + (d.value ?? 0), 0)
  return { title: \`Cash after \${data[focused.value].label}\`, value: running }
})
</script>
<template>
  <OCard class="w-full min-w-0 max-w-xl gap-3 p-5">
    <div>
      <div class="text-xs font-medium text-ousi-muted">{{ shown.title }}</div>
      <div class="text-2xl font-semibold tabular-nums text-ousi-foreground">{{ money(shown.value) }}</div>
    </div>
    <!-- It goes below zero: the line at zero is drawn then. -->
    <OWaterfallChart v-model:focused="focused" :data="data" :height="240" :format-value="money" :tooltip="false" total-label="Cash" />
  </OCard>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'WaterfallChartVariants',
        code: `<script setup lang="ts">
import { OWaterfallChart } from '@ousi-ui/vue'

const data = [
  { label: 'Q1', value: 40 },
  { label: 'Q2', value: 25 },
  { label: 'Q3', value: -18 },
  { label: 'Q4', value: 31 },
  { label: 'Year', total: true },
]
</script>
<template>
  <div class="grid w-full min-w-0 gap-8 md:grid-cols-2">
    <div class="min-w-0">
      <p class="mb-2 text-xs text-ousi-muted">no connectors, no values</p>
      <OWaterfallChart :data="data" :height="200" :connectors="false" :show-values="false" />
    </div>
    <div class="min-w-0">
      <p class="mb-2 text-xs text-ousi-muted">pills, own colours</p>
      <OWaterfallChart :data="data" :height="200" :bar-radius="40" :bar-gap="0.55" increase-color="accent" decrease-color="orange" total-color="violet" :grid="false" :show-y-axis="false" />
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'WaterfallDatum[]', default: '-', description: 'Each: { id?, label, value?, total?, color? }. value is the change. A total is a bar from zero: with a value it sets the running total, without one it shows what has added up.' },
    { name: 'height', type: 'number', default: '280', description: 'Height in px. The width is fluid.' },
    { name: 'barRadius', type: 'number', default: '8', description: 'Corner radius of the bars, in px.' },
    { name: 'barGap', type: 'number', default: '0.35', description: 'Space between bars as a share of each slot.' },
    { name: 'increaseColor', type: 'string', default: '\'success\'', description: 'Colour of rises.' },
    { name: 'decreaseColor', type: 'string', default: '\'danger\'', description: 'Colour of falls.' },
    { name: 'totalColor', type: 'string', default: '\'accent\'', description: 'Colour of totals.' },
    { name: 'connectors', type: 'boolean', default: 'true', description: 'Dashed lines carrying the level to the next bar.' },
    { name: 'showValues', type: 'boolean', default: 'true', description: 'Writes each value above its bar, where it fits.' },
    { name: 'totalLabel', type: 'string', default: '\'Total\'', description: 'The running total, in the tooltip and for screen readers.' },
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
    { name: 'tooltip', type: '{ bar }', description: 'Content of the tooltip.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted bar changed.' },
    { name: 'bar-enter', type: '(bar, event)', description: 'Pointer or focus enters a bar.' },
    { name: 'bar-leave', type: '(bar, event)', description: 'And leaves it.' },
    { name: 'bar-click', type: '(bar, event)', description: 'A bar was clicked.' },
  ],

  keyboard: [
    { key: 'left', description: 'Previous.' },
    { key: 'right', description: 'Next.' },
    { key: 'home', description: 'First.' },
    { key: 'end', description: 'Last.' },
    { key: 'enter', description: 'Emits the click.' },
  ],
}
