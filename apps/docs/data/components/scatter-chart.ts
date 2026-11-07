import type { ComponentData } from './types'

export const scatterChartData: ComponentData = {
  title: 'Scatter Chart',
  description: 'One dot per record to show correlation. Add a z value to any point and it becomes a bubble chart.',
  category: 'Charts',
  importCode: "import { OScatterChart } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ScatterChartBasic',
        code: `<script setup lang="ts">
import { OScatterChart } from '@ousi-ui/vue'

const series = [
  { label: 'Free', color: 'accent', points: [
    { x: 2, y: 12 }, { x: 4, y: 18 }, { x: 5, y: 22 }, { x: 7, y: 25 }, { x: 8, y: 31 }, { x: 10, y: 34 },
  ] },
  { label: 'Pro', color: 'orange', points: [
    { x: 3, y: 38 }, { x: 5, y: 46 }, { x: 6, y: 52 }, { x: 8, y: 61 }, { x: 9, y: 66 }, { x: 11, y: 74 },
  ] },
]
</script>
<template>
  <OScatterChart :series="series" :axis-labels="{ x: 'Sessions per week', y: 'Revenue ($)' }" />
</template>`,
      },
    },
    {
      id: 'cohorts',
      title: 'Recipe: filter series, custom tooltip',
      example: {
        component: 'ScatterChartCohorts',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OScatterChart } from '@ousi-ui/vue'

const rand = (seed: number) => { const x = Math.sin(seed * 91.7) * 43758.5453; return x - Math.floor(x) }
const make = (seed: number, slope: number, base: number) =>
  Array.from({ length: 14 }, (_, i) => ({
    label: \`Account \${seed * 20 + i}\`,
    x: Math.round(2 + i * 1.6 + rand(seed + i) * 3),
    y: Math.round(base + i * slope + rand(seed * 3 + i) * 18),
    z: Math.round(10 + rand(seed * 5 + i) * 90),
  }))
const all = [
  { label: 'Starter', color: 'accent', points: make(1, 2.2, 8) },
  { label: 'Team', color: 'violet', points: make(2, 3.4, 20) },
  { label: 'Enterprise', color: 'orange', points: make(3, 5.1, 34) },
]
const hidden = ref<string[]>([])
const series = computed(() => all.filter((s) => !hidden.value.includes(s.label)))
const toggle = (l: string) => { hidden.value = hidden.value.includes(l) ? hidden.value.filter((x) => x !== l) : [...hidden.value, l] }
const count = computed(() => series.value.reduce((s, x) => s + x.points.length, 0))
</script>
<template>
  <OCard class="w-full max-w-2xl gap-4 p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">Usage vs revenue</div>
        <div class="text-xs tabular-nums text-ousi-muted"><b class="text-ousi-foreground">{{ count }}</b> accounts · bubble = seats</div>
      </div>
      <div class="flex gap-2">
        <button
          v-for="s in all" :key="s.label" type="button"
          class="flex items-center gap-1.5 rounded-full bg-ousi-default px-2.5 py-1 text-xs font-medium transition-opacity"
          :class="hidden.includes(s.label) && 'opacity-40'"
          @click="toggle(s.label)"
        >
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: \`var(--ousi-\${s.color})\` }" />{{ s.label }}
        </button>
      </div>
    </div>
    <OScatterChart :series="series" :height="300" :radius="[4, 16]" :axis-labels="{ x: 'Sessions per week', y: 'MRR ($)' }" :format-y="(v) => \`$\${v}\`">
      <template #tooltip="{ item }">
        <div class="w-44">
          <div class="flex items-center gap-1.5 text-[11px] text-ousi-muted">
            <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: item.color }" />{{ item.series }}
          </div>
          <div class="text-sm font-semibold text-ousi-foreground">{{ item.point.label }}</div>
          <div class="mt-1 grid grid-cols-3 gap-1 text-center text-[11px]">
            <div class="rounded-lg bg-ousi-default py-1"><div class="font-semibold tabular-nums text-ousi-foreground">{{ item.formattedX }}</div>sessions</div>
            <div class="rounded-lg bg-ousi-default py-1"><div class="font-semibold tabular-nums text-ousi-foreground">{{ item.formattedY }}</div>MRR</div>
            <div class="rounded-lg bg-ousi-default py-1"><div class="font-semibold tabular-nums text-ousi-foreground">{{ item.point.z }}</div>seats</div>
          </div>
        </div>
      </template>
    </OScatterChart>
  </OCard>
</template>`,
      },
    },
    {
      id: 'bubble',
      title: 'Bubbles',
      example: {
        component: 'ScatterChartBubble',
        code: `<script setup lang="ts">
import { OScatterChart } from '@ousi-ui/vue'

// Any point with a \`z\` turns the chart into a bubble chart.
const series = [
  { label: 'Europe', color: 'accent', points: [
    { label: 'Spain', x: 48, y: 7.2, z: 47 }, { label: 'France', x: 68, y: 6.1, z: 68 },
    { label: 'Germany', x: 84, y: 5.4, z: 84 }, { label: 'Italy', x: 59, y: 6.8, z: 59 },
  ] },
  { label: 'Americas', color: 'success', points: [
    { label: 'Brazil', x: 214, y: 9.4, z: 214 }, { label: 'Mexico', x: 128, y: 8.1, z: 128 },
    { label: 'Chile', x: 19, y: 7.7, z: 19 },
  ] },
  { label: 'Asia', color: 'violet', points: [
    { label: 'Japan', x: 125, y: 4.2, z: 125 }, { label: 'India', x: 380, y: 11.3, z: 380 },
    { label: 'Korea', x: 52, y: 5.0, z: 52 },
  ] },
]
</script>
<template>
  <OScatterChart
    :series="series"
    :height="340"
    :radius="[6, 26]"
    :axis-labels="{ x: 'Users (millions)', y: 'Growth (%)' }"
    :format-y="(v) => \`\${v}%\`"
  />
</template>`,
      },
    },
    {
      id: 'hover',
      title: 'Recipe: header reacts to hover',
      example: {
        component: 'ScatterChartHover',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OScatterChart } from '@ousi-ui/vue'
import type { ScatterFocus } from '@ousi-ui/vue'

const series = [
  { label: 'Free', color: 'accent', points: [
    { label: 'Cohort A', x: 2, y: 12 }, { label: 'Cohort B', x: 4, y: 18 }, { label: 'Cohort C', x: 7, y: 25 }, { label: 'Cohort D', x: 10, y: 34 },
  ] },
  { label: 'Pro', color: 'orange', points: [
    { label: 'Cohort E', x: 3, y: 38 }, { label: 'Cohort F', x: 6, y: 52 }, { label: 'Cohort G', x: 9, y: 66 }, { label: 'Cohort H', x: 11, y: 74 },
  ] },
]
const focused = ref<ScatterFocus | null>(null)
const point = computed(() => (focused.value ? series[focused.value.series].points[focused.value.point] : null))
const avg = series.map((s) => s.points.reduce((t, p) => t + p.y, 0) / s.points.length)
</script>
<template>
  <OCard class="w-full max-w-xl gap-4 p-5">
    <div>
      <div class="text-sm font-medium text-ousi-muted">{{ point ? point.label : 'Revenue by usage' }}</div>
      <div class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground">\${{ point ? point.y : 742 }}</div>
    </div>
    <!-- Hovering a point dims the other series, so the cohort stands out. -->
    <OScatterChart v-model:focused="focused" :series="series" :height="240" :tooltip="false" :axis-labels="{ x: 'Sessions', y: 'Revenue' }" />
    <div class="flex gap-4 text-xs text-ousi-muted">
      <span v-for="(s, i) in series" :key="s.label" class="flex items-center gap-1.5">
        <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: \`var(--ousi-\${s.color})\` }" />
        {{ s.label }} · avg <span class="font-medium tabular-nums text-ousi-foreground">\${{ avg[i].toFixed(0) }}</span>
      </span>
    </div>
  </OCard>
</template>`,
      },
    },
    {
      id: 'tooltip',
      title: 'Custom tooltip',
      example: {
        component: 'ScatterChartTooltip',
        code: `<script setup lang="ts">
import { OScatterChart } from '@ousi-ui/vue'

const series = [
  { label: 'Plan A', color: 'violet', points: [
    { label: 'Acme', x: 12, y: 340, z: 8 }, { label: 'Globex', x: 28, y: 520, z: 15 }, { label: 'Initech', x: 41, y: 610, z: 22 },
  ] },
  { label: 'Plan B', color: 'success', points: [
    { label: 'Umbrella', x: 18, y: 280, z: 6 }, { label: 'Hooli', x: 35, y: 450, z: 12 }, { label: 'Stark', x: 52, y: 760, z: 30 },
  ] },
]
</script>
<template>
  <OScatterChart :series="series" :axis-labels="{ x: 'Seats', y: 'MRR' }" :format-y="(v) => \`$\${v}\`">
    <template #tooltip="{ item }">
      <div class="w-40">
        <div class="flex items-center gap-1.5 text-xs text-ousi-muted">
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: item.color }" />{{ item.series }}
        </div>
        <div class="mt-0.5 text-base font-semibold text-ousi-foreground">{{ item.point.label }}</div>
        <div class="mt-1 text-xs tabular-nums text-ousi-muted">
          {{ item.formattedX }} seats · {{ item.formattedY }} MRR · {{ item.point.z }} users
        </div>
      </div>
    </template>
  </OScatterChart>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'ScatterChartVariants',
        code: `<script setup lang="ts">
import { OScatterChart } from '@ousi-ui/vue'

const series = [
  { label: 'Sample', color: 'accent', points: Array.from({ length: 24 }, (_, i) => ({ x: i + 1, y: 20 + i * 2.1 + ((i * 37) % 17) })) },
]
const bubbles = [
  { label: 'Sample', color: 'orange', points: Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: 20 + i * 3 + ((i * 29) % 13), z: 5 + ((i * 7) % 20) })) },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">No grid, no axes</p>
      <OScatterChart :series="series" :height="190" :grid="false" :show-x-axis="false" :show-y-axis="false" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Bubble forced off (:bubble="false")</p>
      <OScatterChart :series="bubbles" :height="190" :bubble="false" />
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'series', type: 'ScatterSeries[]', description: 'Series: { label, points: { x, y, z?, label? }[], color? }.' },
    { name: 'height', type: 'number', default: '300', description: 'Chart height in px. Width is fluid.' },
    { name: 'bubble', type: 'boolean', default: 'auto', description: 'Size dots by z. Detected automatically; pass false to force plain dots.' },
    { name: 'radius', type: '[number, number]', default: '[5, 18]', description: 'Radius range of the dots in px.' },
    { name: 'grid', type: 'boolean', default: 'true', description: 'Show grid lines.' },
    { name: 'showXAxis', type: 'boolean', default: 'true', description: 'Show x axis labels.' },
    { name: 'showYAxis', type: 'boolean', default: 'true', description: 'Show y axis labels.' },
    { name: 'axisLabels', type: '{ x?, y? }', description: 'Captions for the axes.' },
    { name: 'formatX', type: '(value: number) => string', description: 'Formats x values.' },
    { name: 'formatY', type: '(value: number) => string', description: 'Formats y values.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'Show the built-in tooltip.' },
    { name: 'focused', type: '{ series, point } | null', default: 'null', description: 'Highlighted point. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount.' },
    { name: 'padding', type: '{ top?, right?, bottom?, left? }', description: 'Plot spacing in px.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'tooltip', type: '{ item }', description: 'Replaces the tooltip content. item has series, color, point and formatted x and y.' },
  ],

  emits: [
    { name: 'update:focused', type: '(focus: { series, point } | null)', description: 'Highlighted point changed (v-model:focused).' },
    { name: 'point-enter', type: '(item: ScatterItem, event: Event)', description: 'Pointer or keyboard focus enters a point.' },
    { name: 'point-leave', type: '(item: ScatterItem, event: Event)', description: 'Pointer or keyboard focus leaves a point.' },
    { name: 'point-click', type: '(item: ScatterItem, event: Event)', description: 'A point is clicked or activated with Enter/Space.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between points, series after series.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
