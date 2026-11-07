import type { ComponentData } from './types'

export const barChartData: ComponentData = {
  title: 'Bar Chart',
  description: 'Vertical or horizontal bars, grouped or stacked, with an optional track behind each bar, a ring around the hovered one and custom value ticks.',
  category: 'Charts',
  importCode: "import { OBarChart } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Track, ring and custom ticks',
      example: {
        component: 'BarChartBasic',
        code: `<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

// A full-length track behind each bar, a ring around the hovered one and custom value ticks.
const data = [
  { m: 'Jan', v: 3100 }, { m: 'Feb', v: 6900 }, { m: 'Mar', v: 9650 }, { m: 'Apr', v: 6400 },
  { m: 'May', v: 3600 }, { m: 'Jun', v: 2400 }, { m: 'Jul', v: 3800 }, { m: 'Aug', v: 5100 },
  { m: 'Sep', v: 6600 }, { m: 'Oct', v: 4700 }, { m: 'Nov', v: 11400 }, { m: 'Dec', v: 7900 },
]
const short = (v: number) => (v >= 1000 ? \`$\${v / 1000}K\` : \`$\${v}\`)
</script>
<template>
  <OBarChart
    :data="data"
    category-key="m"
    :series="[{ key: 'v', label: 'Earned', color: '#aee637' }]"
    track
    :ticks="[0, 3000, 5000, 10000]"
    :max="12000"
    :height="300"
    :format-value="short"
  />
</template>`,
      },
    },
    {
      id: 'earnings',
      title: 'Recipe: earnings with period tabs',
      example: {
        component: 'BarChartEarnings',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OBarChart, OCard } from '@ousi-ui/vue'

const sets = {
  Weekly: { delta: 14.8, ticks: [0, 500, 1000, 1500], rows: [
    { l: 'Mon', v: 820 }, { l: 'Tue', v: 1140 }, { l: 'Wed', v: 960 }, { l: 'Thu', v: 1480 },
    { l: 'Fri', v: 1320 }, { l: 'Sat', v: 1050 }, { l: 'Sun', v: 692 },
  ] },
  Monthly: { delta: 9.2, ticks: [0, 3000, 5000, 10000], rows: [
    { l: 'Jan', v: 3100 }, { l: 'Feb', v: 6900 }, { l: 'Mar', v: 9650 }, { l: 'Apr', v: 6400 }, { l: 'May', v: 3600 }, { l: 'Jun', v: 2400 },
    { l: 'Jul', v: 3800 }, { l: 'Aug', v: 5100 }, { l: 'Sep', v: 6600 }, { l: 'Oct', v: 4700 }, { l: 'Nov', v: 11400 }, { l: 'Dec', v: 7900 },
  ] },
  Yearly: { delta: 21.5, ticks: [0, 25000, 50000, 100000], rows: [
    { l: '2021', v: 38000 }, { l: '2022', v: 56000 }, { l: '2023', v: 71000 }, { l: '2024', v: 92000 }, { l: '2025', v: 104000 },
  ] },
} as const
type Range = keyof typeof sets

const range = ref<Range>('Monthly')
const focused = ref<number | null>(null)
const set = computed(() => sets[range.value])
const total = computed(() => set.value.rows.reduce((s, r) => s + r.v, 0))
const active = computed(() => (focused.value == null ? null : set.value.rows[focused.value]))
const short = (v: number) => (v >= 1000 ? \`$\${v / 1000}K\` : \`$\${v}\`)
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-3xl gap-5 p-5">
    <div class="flex items-start justify-between">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ active ? \`Earned · \${active.l}\` : 'Earned so far' }}</div>
        <div class="mt-1 flex items-center gap-3">
          <OAnimatedNumber locale="en-US" :value="active ? active.v : total" :format-options="usd" animation="count" :duration="300" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
          <span class="rounded-lg bg-ousi-success/20 px-2 py-0.5 text-sm font-medium tabular-nums text-ousi-success-soft-strong">+{{ set.delta }}%</span>
        </div>
      </div>
      <div class="flex gap-1">
        <button
          v-for="(_, r) in sets" :key="r" type="button"
          class="rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors"
          :class="range === r ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="range = r as Range"
        >{{ r }}</button>
      </div>
    </div>
    <OBarChart
      :key="range"
      v-model:focused="focused"
      :data="set.rows"
      category-key="l"
      :series="[{ key: 'v', label: 'Earned', color: '#aee637' }]"
      track
      :ticks="[...set.ticks]"
      :height="300"
      :tooltip="false"
      :format-value="short"
    />
  </OCard>
</template>`,
      },
    },
    {
      id: 'grouped',
      title: 'Grouped',
      example: {
        component: 'BarChartGrouped',
        code: `<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { q: 'Q1', web: 42, mobile: 28, api: 12 }, { q: 'Q2', web: 51, mobile: 34, api: 18 },
  { q: 'Q3', web: 47, mobile: 41, api: 24 }, { q: 'Q4', web: 63, mobile: 52, api: 31 },
]
</script>
<template>
  <OBarChart
    :data="data"
    category-key="q"
    :bar-radius="8"
    :bar-gap="0.3"
    grid
    :series="[
      { key: 'web', label: 'Web', color: 'accent' },
      { key: 'mobile', label: 'Mobile', color: 'violet' },
      { key: 'api', label: 'API', color: 'orange' },
    ]"
    :format-value="(v) => \`\${v}k\`"
  />
</template>`,
      },
    },
    {
      id: 'stacked',
      title: 'Stacked',
      example: {
        component: 'BarChartStacked',
        code: `<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { d: 'Mon', paid: 120, organic: 210, referral: 60 }, { d: 'Tue', paid: 150, organic: 240, referral: 75 },
  { d: 'Wed', paid: 90, organic: 260, referral: 82 }, { d: 'Thu', paid: 170, organic: 300, referral: 95 },
  { d: 'Fri', paid: 210, organic: 280, referral: 110 }, { d: 'Sat', paid: 80, organic: 180, referral: 40 },
  { d: 'Sun', paid: 60, organic: 150, referral: 35 },
]
</script>
<template>
  <!-- Stacked bars are rounded as a whole; the tooltip adds the total -->
  <OBarChart
    :data="data"
    category-key="d"
    stacked
    :bar-radius="10"
    :series="[
      { key: 'organic', label: 'Organic', color: '#4f8ff7' },
      { key: 'paid', label: 'Paid', color: '#b57bff' },
      { key: 'referral', label: 'Referral', color: '#aee637' },
    ]"
  />
</template>`,
      },
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      example: {
        component: 'BarChartHorizontal',
        code: `<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { c: 'Spain', v: 8420 }, { c: 'Mexico', v: 7310 }, { c: 'Colombia', v: 6150 },
  { c: 'Chile', v: 4280 }, { c: 'Peru', v: 3190 }, { c: 'Uruguay', v: 1640 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Ranking with track</p>
      <OBarChart :data="data" category-key="c" orientation="horizontal" track :bar-radius="10" :bar-gap="0.4" :height="260" :series="[{ key: 'v', label: 'Users', color: '#4f8ff7' }]" :ticks="[0, 4000, 8000]" :max="9000" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Horizontal stacked</p>
      <OBarChart
        :data="[{ c: 'Free', a: 40, b: 25 }, { c: 'Pro', a: 28, b: 35 }, { c: 'Team', a: 18, b: 22 }, { c: 'Enterprise', a: 9, b: 14 }]"
        category-key="c" orientation="horizontal" stacked :bar-radius="8" :height="260" grid
        :series="[{ key: 'a', label: 'Active', color: 'success' }, { key: 'b', label: 'Dormant', color: '#9ca3af' }]"
      />
    </div>
  </div>
</template>`,
      },
    },
    {
      id: 'tooltip',
      title: 'Custom tooltip',
      example: {
        component: 'BarChartTooltip',
        code: `<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { w: 'W1', plan: 120, done: 96 }, { w: 'W2', plan: 140, done: 148 }, { w: 'W3', plan: 130, done: 101 },
  { w: 'W4', plan: 150, done: 152 }, { w: 'W5', plan: 160, done: 118 }, { w: 'W6', plan: 150, done: 163 },
]
</script>
<template>
  <OBarChart :data="data" category-key="w" :bar-radius="8" :series="[{ key: 'plan', label: 'Planned', color: '#9ca3af' }, { key: 'done', label: 'Done', color: 'success' }]">
    <template #tooltip="{ point }">
      <div class="w-40">
        <div class="text-[11px] uppercase tracking-wide text-ousi-muted">{{ point.category }}</div>
        <div class="mt-0.5 text-lg font-semibold tabular-nums" :class="point.values[1].value >= point.values[0].value ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
          {{ Math.round((point.values[1].value / point.values[0].value) * 100) }}%
        </div>
        <div class="text-xs text-ousi-muted">{{ point.values[1].formatted }} of {{ point.values[0].formatted }} planned</div>
        <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-ousi-default">
          <div class="h-full rounded-full" :style="{ width: \`\${Math.min((point.values[1].value / point.values[0].value) * 100, 100)}%\`, backgroundColor: point.values[1].color }" />
        </div>
      </div>
    </template>
  </OBarChart>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'BarChartVariants',
        code: `<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { d: 'M', v: 62 }, { d: 'T', v: 88 }, { d: 'W', v: 45 }, { d: 'T', v: 95 }, { d: 'F', v: 71 }, { d: 'S', v: 30 }, { d: 'S', v: 18 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-3">
    <div><p class="mb-2 text-xs text-ousi-muted">dim others on hover, no ring (:outline="false")</p><OBarChart :data="data" category-key="d" :height="170" dim :outline="false" :show-y-axis="false" :series="[{ key: 'v', color: 'violet' }]" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">pills (large radius, tall gap)</p><OBarChart :data="data" category-key="d" :height="170" track :bar-radius="20" :bar-gap="0.55" :show-y-axis="false" :series="[{ key: 'v', color: 'orange' }]" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">square, no axes</p><OBarChart :data="data" category-key="d" :height="170" :bar-radius="0" :show-x-axis="false" :show-y-axis="false" :series="[{ key: 'v', color: '#f43f5e' }]" /></div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'Record<string, unknown>[]', description: 'One row per category.' },
    { name: 'categoryKey', type: 'string', description: 'Field holding the category label.' },
    { name: 'series', type: 'BarSeries[]', description: 'Series: { key, label?, color?, format? }.' },
    { name: 'orientation', type: '\'vertical\' | \'horizontal\'', default: '\'vertical\'', description: 'Direction of the bars.' },
    { name: 'stacked', type: 'boolean', default: 'false', description: 'Stack the series in one bar instead of placing them side by side.' },
    { name: 'height', type: 'number', default: '280', description: 'Chart height in px. Width is fluid.' },
    { name: 'track', type: 'boolean', default: 'false', description: 'Draw a full-length rounded track behind each category.' },
    { name: 'trackColor', type: 'string', default: '\'var(--ousi-default)\'', description: 'Color of the track.' },
    { name: 'ticks', type: 'number[]', description: 'Value ticks, any list: [0, 3000, 5000, 10000]. The axis ends at the largest one.' },
    { name: 'max', type: 'number', default: 'nice number', description: 'Value at the end of the axis.' },
    { name: 'barRadius', type: 'number', default: '12', description: 'Corner radius of the bars in px.' },
    { name: 'barGap', type: 'number', default: '0.35', description: 'Space between categories as a fraction of the band (0-0.9).' },
    { name: 'groupGap', type: 'number', default: '4', description: 'Space between bars of the same category (grouped), in px.' },
    { name: 'outline', type: 'boolean', default: 'true', description: 'Ring around the hovered category. Set it to false to hide the ring.' },
    { name: 'dim', type: 'boolean', default: 'false', description: 'Fade the other categories on hover.' },
    { name: 'grid', type: 'boolean', default: 'false', description: 'Show grid lines.' },
    { name: 'showXAxis', type: 'boolean', default: 'true', description: 'Show the category labels.' },
    { name: 'showYAxis', type: 'boolean', default: 'true', description: 'Show the value labels.' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Formats ticks and tooltip values.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'Show the built-in tooltip.' },
    { name: 'focused', type: 'number | null', default: 'null', description: 'Highlighted category index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount.' },
    { name: 'padding', type: '{ top?, right?, bottom?, left? }', description: 'Plot spacing in px.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'tooltip', type: '{ point }', description: 'Replaces the tooltip content. point has index, category, datum, values, total and x/y.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted category changed (v-model:focused).' },
    { name: 'point-enter', type: '(point: BarChartPoint, event: Event)', description: 'Pointer or keyboard focus enters a category.' },
    { name: 'point-leave', type: '(point: BarChartPoint, event: Event)', description: 'Pointer or keyboard focus leaves a category.' },
    { name: 'point-click', type: '(point: BarChartPoint, event: Event)', description: 'A category is clicked or activated with Enter/Space.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between categories.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
