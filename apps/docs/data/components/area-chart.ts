import type { ComponentData } from './types'

export const areaChartData: ComponentData = {
  title: 'Area Chart',
  description: 'One or more lines with a soft fill. Dashed series are drawn without fill, which makes them a natural reference such as last year.',
  category: 'Charts',
  importCode: "import { OAreaChart } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'AreaChartBasic',
        code: `<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

const data = [
  { m: 'Jan', v: 12400 }, { m: 'Feb', v: 13800 }, { m: 'Mar', v: 13100 }, { m: 'Apr', v: 15600 },
  { m: 'May', v: 17200 }, { m: 'Jun', v: 16800 }, { m: 'Jul', v: 19400 }, { m: 'Aug', v: 21000 },
]
</script>
<template>
  <OAreaChart
    :data="data"
    category-key="m"
    :series="[{ key: 'v', label: 'Revenue' }]"
    :format-value="(v) => \`$\${(v / 1000).toFixed(0)}k\`"
  />
</template>`,
      },
    },
    {
      id: 'stock',
      title: 'Recipe: stock price',
      example: {
        component: 'AreaChartStock',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OAreaChart, OCard } from '@ousi-ui/vue'

const rand = (seed: number) => { const x = Math.sin(seed * 78.233) * 43758.5453; return x - Math.floor(x) }
// Deterministic random walk
function walk(n: number, start: number, vol: number, seed: number, drift: number) {
  let v = start
  return Array.from({ length: n }, (_, i) => { v += (rand(seed + i) - 0.5 + drift) * vol; return Math.round(v * 100) / 100 })
}
const sets = {
  '1D': { labels: Array.from({ length: 12 }, (_, i) => \`\${9 + i}:00\`), data: walk(12, 182, 1.6, 3, 0.05) },
  '1W': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: walk(5, 178, 4, 11, -0.1) },
  '1M': { labels: Array.from({ length: 20 }, (_, i) => \`Jun \${i + 1}\`), data: walk(20, 170, 3, 21, 0.12) },
  '1Y': { labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: walk(12, 140, 9, 31, 0.2) },
} as const
type Range = keyof typeof sets

const range = ref<Range>('1M')
const focused = ref<number | null>(null)
const rows = computed(() => sets[range.value].data.map((price, i) => ({ t: sets[range.value].labels[i], price })))
const first = computed(() => rows.value[0].price)
const price = computed(() => (focused.value == null ? rows.value[rows.value.length - 1] : rows.value[focused.value]).price)
const change = computed(() => ((price.value - first.value) / first.value) * 100)
const up = computed(() => change.value >= 0)
const usd = { style: 'currency', currency: 'USD' } as const
</script>
<template>
  <OCard class="w-full max-w-2xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">ACME · {{ focused == null ? 'Price' : rows[focused].t }}</div>
        <div class="mt-1 flex items-baseline gap-3">
          <OAnimatedNumber locale="en-US" :value="price" :format-options="usd" animation="count" :duration="250" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
          <span class="text-sm font-medium tabular-nums" :class="up ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
            {{ up ? '▲' : '▼' }} {{ Math.abs(change).toFixed(2) }}%
          </span>
        </div>
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="(_, r) in sets" :key="r" type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="range === r ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="range = r as Range"
        >{{ r }}</button>
      </div>
    </div>
    <!-- The line turns red or green with the trend of the selected range -->
    <OAreaChart
      :key="range"
      v-model:focused="focused"
      :data="rows"
      category-key="t"
      :height="240"
      baseline="auto"
      :tooltip="false"
      :show-x-axis="false"
      :format-value="(v) => \`$\${v.toFixed(0)}\`"
      :series="[{ key: 'price', label: 'Price', color: up ? 'success' : 'danger' }]"
    />
  </OCard>
</template>`,
      },
    },
    {
      id: 'sparklines',
      title: 'Sparklines in KPI cards',
      example: {
        component: 'AreaChartSparklines',
        code: `<script setup lang="ts">
import { OAreaChart, OCard } from '@ousi-ui/vue'

const spark = (vals: number[]) => vals.map((v, i) => ({ i, v }))
const kpis = [
  { label: 'Revenue', value: '$48.2k', delta: 12.4, color: 'success', data: spark([22, 26, 24, 30, 28, 35, 38, 42, 40, 48]) },
  { label: 'Sessions', value: '128k', delta: 4.1, color: 'accent', data: spark([60, 58, 66, 64, 70, 68, 75, 72, 80, 84]) },
  { label: 'Churn', value: '2.1%', delta: -0.6, color: 'violet', invert: true, data: spark([34, 32, 33, 30, 29, 30, 27, 25, 24, 22]) },
  { label: 'Refunds', value: '$1.9k', delta: 8.2, color: 'danger', invert: true, data: spark([10, 12, 11, 14, 13, 16, 15, 18, 17, 19]) },
]
const good = (k: { delta: number; invert?: boolean }) => (k.invert ? k.delta <= 0 : k.delta >= 0)
</script>
<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <OCard v-for="k in kpis" :key="k.label" class="gap-1 p-4">
      <div class="text-xs font-medium text-ousi-muted">{{ k.label }}</div>
      <div class="flex items-baseline justify-between">
        <span class="text-xl font-semibold tabular-nums text-ousi-foreground">{{ k.value }}</span>
        <span class="text-xs font-medium tabular-nums" :class="good(k) ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
          {{ k.delta > 0 ? '+' : '' }}{{ k.delta }}%
        </span>
      </div>
      <!-- A sparkline is just an area chart without axes, grid or interaction -->
      <OAreaChart
        :data="k.data" category-key="i" :height="56" baseline="auto" :interactive="false"
        :show-x-axis="false" :show-y-axis="false" :grid="false" :fill-opacity="0.35"
        :padding="{ top: 6, right: 2, bottom: 2, left: 2 }"
        :series="[{ key: 'v', color: k.color, strokeWidth: 2 }]"
      />
    </OCard>
  </div>
</template>`,
      },
    },
    {
      id: 'compare',
      title: 'Compare with a dashed series',
      example: {
        component: 'AreaChartCompare',
        code: `<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

// A dashed series is drawn without fill, so it reads as the reference period.
const data = [
  { m: 'Jan', current: 12400, previous: 10200 }, { m: 'Feb', current: 13800, previous: 11000 },
  { m: 'Mar', current: 13100, previous: 12300 }, { m: 'Apr', current: 15600, previous: 12800 },
  { m: 'May', current: 17200, previous: 13900 }, { m: 'Jun', current: 16800, previous: 14400 },
  { m: 'Jul', current: 19400, previous: 15100 }, { m: 'Aug', current: 21000, previous: 16000 },
]
const usd = (v: number) => \`$\${(v / 1000).toFixed(0)}k\`
</script>
<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-4 text-xs text-ousi-muted">
      <span class="flex items-center gap-1.5"><span class="inline-block h-0.5 w-4 rounded bg-ousi-accent" />This year</span>
      <span class="flex items-center gap-1.5"><span class="inline-block h-0.5 w-4 rounded border-t-2 border-dashed border-ousi-muted" />Last year</span>
    </div>
    <OAreaChart
      :data="data"
      category-key="m"
      :format-value="usd"
      :series="[
        { key: 'previous', label: 'Last year', color: 'var(--ousi-muted)', dashed: true },
        { key: 'current', label: 'This year', color: 'accent' },
      ]"
    />
  </div>
</template>`,
      },
    },
    {
      id: 'multi',
      title: 'Multiple series',
      example: {
        component: 'AreaChartMulti',
        code: `<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

const data = [
  { d: 'Mon', web: 420, ios: 260, android: 180 }, { d: 'Tue', web: 510, ios: 300, android: 210 },
  { d: 'Wed', web: 480, ios: 340, android: 260 }, { d: 'Thu', web: 620, ios: 380, android: 240 },
  { d: 'Fri', web: 700, ios: 410, android: 300 }, { d: 'Sat', web: 540, ios: 460, android: 350 },
  { d: 'Sun', web: 460, ios: 420, android: 330 },
]
</script>
<template>
  <OAreaChart
    :data="data"
    category-key="d"
    curve="linear"
    show-points
    :series="[
      { key: 'web', label: 'Web', color: 'accent' },
      { key: 'ios', label: 'iOS', color: 'violet' },
      { key: 'android', label: 'Android', color: 'success' },
    ]"
  />
</template>`,
      },
    },
    {
      id: 'hover',
      title: 'Recipe: header reacts to hover',
      example: {
        component: 'AreaChartHover',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OAreaChart } from '@ousi-ui/vue'

const data = [
  { m: 'Jan', current: 12400, previous: 10200 }, { m: 'Feb', current: 13800, previous: 11000 },
  { m: 'Mar', current: 13100, previous: 12300 }, { m: 'Apr', current: 15600, previous: 12800 },
  { m: 'May', current: 17200, previous: 13900 }, { m: 'Jun', current: 16800, previous: 14400 },
  { m: 'Jul', current: 19400, previous: 15100 }, { m: 'Aug', current: 21000, previous: 16000 },
]
const focused = ref<number | null>(null)
const row = computed(() => (focused.value == null ? null : data[focused.value]))
const ytd = data.reduce((s, r) => s + r.current, 0)
const ytdPrev = data.reduce((s, r) => s + r.previous, 0)
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ row ? \`Revenue · \${row.m}\` : 'Revenue year to date' }}</div>
        <OAnimatedNumber locale="en-US"
          :value="row ? row.current : ytd"
          :format-options="usd"
          animation="count"
          class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground"
        />
      </div>
      <div class="text-right text-xs text-ousi-muted">
        <div>Last year</div>
        <div class="text-sm font-medium tabular-nums text-ousi-foreground">
          {{ (row ? row.previous : ytdPrev).toLocaleString('en-US', usd) }}
        </div>
      </div>
    </div>
    <OAreaChart
      v-model:focused="focused"
      :data="data"
      category-key="m"
      :height="220"
      :tooltip="false"
      :show-y-axis="false"
      :series="[
        { key: 'previous', label: 'Last year', color: 'var(--ousi-muted)', dashed: true },
        { key: 'current', label: 'This year', color: 'accent' },
      ]"
    />
  </OCard>
</template>`,
      },
    },
    {
      id: 'tooltip',
      title: 'Custom tooltip',
      example: {
        component: 'AreaChartTooltip',
        code: `<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

const data = [
  { m: 'Jan', current: 12400, previous: 10200 }, { m: 'Feb', current: 13800, previous: 11000 },
  { m: 'Mar', current: 13100, previous: 12300 }, { m: 'Apr', current: 15600, previous: 12800 },
  { m: 'May', current: 17200, previous: 13900 }, { m: 'Jun', current: 16800, previous: 14400 },
]
</script>
<template>
  <OAreaChart
    :data="data"
    category-key="m"
    :series="[
      { key: 'previous', label: 'Last year', color: 'var(--ousi-muted)', dashed: true },
      { key: 'current', label: 'This year', color: 'success' },
    ]"
  >
    <template #tooltip="{ point }">
      <div class="w-40">
        <div class="text-[11px] uppercase tracking-wide text-ousi-muted">{{ point.category }}</div>
        <div class="mt-1 text-lg font-semibold tabular-nums text-ousi-foreground">{{ point.values[1].formatted }}</div>
        <div
          class="text-xs font-medium tabular-nums"
          :class="point.values[1].value >= point.values[0].value ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'"
        >
          {{ point.values[1].value >= point.values[0].value ? '▲' : '▼' }}
          {{ Math.abs(Math.round((point.values[1].value / point.values[0].value - 1) * 100)) }}% vs last year
        </div>
      </div>
    </template>
  </OAreaChart>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'AreaChartVariants',
        code: `<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

const data = [
  { d: 'Mon', v: 62 }, { d: 'Tue', v: 68 }, { d: 'Wed', v: 64 }, { d: 'Thu', v: 75 },
  { d: 'Fri', v: 81 }, { d: 'Sat', v: 77 }, { d: 'Sun', v: 84 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">baseline="auto" (fits the data)</p>
      <OAreaChart :data="data" category-key="d" baseline="auto" :height="170" :series="[{ key: 'v', label: 'Score', color: 'violet' }]" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Linear, with points</p>
      <OAreaChart :data="data" category-key="d" curve="linear" show-points :height="170" :series="[{ key: 'v', label: 'Score', color: 'orange' }]" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">No axes, no grid</p>
      <OAreaChart :data="data" category-key="d" :show-x-axis="false" :show-y-axis="false" :grid="false" :height="120" :series="[{ key: 'v', label: 'Score', color: 'success' }]" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Static, stronger fill</p>
      <OAreaChart :data="data" category-key="d" :interactive="false" :fill-opacity="0.5" :height="170" :series="[{ key: 'v', label: 'Score', color: '#f43f5e' }]" />
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'Record<string, unknown>[]', description: 'One row per category.' },
    { name: 'categoryKey', type: 'string', description: 'Field holding the category label.' },
    { name: 'series', type: 'AreaSeries[]', description: 'Series: { key, label?, color?, dashed?, fill?, strokeWidth?, format? }.' },
    { name: 'height', type: 'number', default: '260', description: 'Chart height in px. Width is fluid.' },
    { name: 'grid', type: 'boolean', default: 'true', description: 'Show horizontal grid lines.' },
    { name: 'curve', type: '\'smooth\' | \'linear\'', default: '\'smooth\'', description: 'Line interpolation.' },
    { name: 'baseline', type: '\'zero\' | \'auto\'', default: '\'zero\'', description: 'Start the axis at 0 or fit the data.' },
    { name: 'fillOpacity', type: 'number', default: '0.28', description: 'Opacity at the top of the fill.' },
    { name: 'showXAxis', type: 'boolean', default: 'true', description: 'Show category labels.' },
    { name: 'showYAxis', type: 'boolean', default: 'true', description: 'Show value labels.' },
    { name: 'showPoints', type: 'boolean', default: 'false', description: 'Show a dot on every category (otherwise only on hover).' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Default formatter for the axis and tooltip.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'Show the built-in tooltip.' },
    { name: 'focused', type: 'number | null', default: 'null', description: 'Highlighted category index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount.' },
    { name: 'padding', type: '{ top?, right?, bottom?, left? }', description: 'Plot spacing in px.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'tooltip', type: '{ point }', description: 'Replaces the tooltip content. point has index, category, datum, x and values.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted category changed (v-model:focused).' },
    { name: 'point-enter', type: '(point: AreaChartPoint, event: Event)', description: 'Pointer or keyboard focus enters a category.' },
    { name: 'point-leave', type: '(point: AreaChartPoint, event: Event)', description: 'Pointer or keyboard focus leaves a category.' },
    { name: 'point-click', type: '(point: AreaChartPoint, event: Event)', description: 'A category is clicked or activated with Enter/Space.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between categories.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
