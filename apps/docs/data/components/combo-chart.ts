import type { ComponentData } from './types'

export const comboChartData: ComponentData = {
  title: 'Combo Chart',
  description: 'Bars on a left axis and a line on a right axis, in one chart. Each series has its own scale and formatter. It has no card or header of its own: wrap it however you like (see the recipes).',
  category: 'Charts',
  importCode: "import { OComboChart } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ComboChartBasic',
        code: `<script setup lang="ts">
import { OComboChart } from '@ousi-ui/vue'

const data = [
  { month: 'Jan', sessions: 8200, conversion: 2.9 },
  { month: 'Feb', sessions: 9100, conversion: 3.1 },
  { month: 'Mar', sessions: 8700, conversion: 3.0 },
  { month: 'Apr', sessions: 10400, conversion: 3.6 },
  { month: 'May', sessions: 11800, conversion: 3.9 },
  { month: 'Jun', sessions: 12600, conversion: 4.2 },
]
</script>
<template>
  <OComboChart
    :data="data"
    category-key="month"
    :bar="{ key: 'sessions', label: 'Sessions' }"
    :line="{ key: 'conversion', label: 'Conversion', format: (v) => \`\${v}%\` }"
  />
</template>`,
      },
    },
    {
      id: 'formats',
      title: 'Axes and formats',
      example: {
        component: 'ComboChartFormats',
        code: `<script setup lang="ts">
import { OComboChart } from '@ousi-ui/vue'

// Each series has its own axis and formatter, so a currency and a ratio can share one chart.
const data = [
  { q: 'Q1 24', revenue: 182000, margin: 21.4 },
  { q: 'Q2 24', revenue: 214000, margin: 23.1 },
  { q: 'Q3 24', revenue: 196000, margin: 19.8 },
  { q: 'Q4 24', revenue: 268000, margin: 26.5 },
  { q: 'Q1 25', revenue: 241000, margin: 24.2 },
  { q: 'Q2 25', revenue: 305000, margin: 28.7 },
]
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 0 })
</script>
<template>
  <OComboChart
    :data="data"
    category-key="q"
    :bar="{ key: 'revenue', label: 'Revenue', color: 'var(--ousi-violet)', format: (v) => usd.format(v) }"
    :line="{ key: 'margin', label: 'Margin', color: 'var(--ousi-success)', format: (v) => \`\${v.toFixed(1)}%\` }"
  />
</template>`,
      },
    },
    {
      id: 'card',
      title: 'Recipe: traffic card',
      example: {
        component: 'ComboChartCard',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OComboChart } from '@ousi-ui/vue'

const periods = {
  '7d': [
    { d: 'Mon', sessions: 3200, conv: 3.1 }, { d: 'Tue', sessions: 3900, conv: 3.4 },
    { d: 'Wed', sessions: 3500, conv: 3.0 }, { d: 'Thu', sessions: 4400, conv: 3.9 },
    { d: 'Fri', sessions: 5100, conv: 4.2 }, { d: 'Sat', sessions: 2800, conv: 2.7 },
    { d: 'Sun', sessions: 2400, conv: 2.5 },
  ],
  '30d': [
    { d: 'W1', sessions: 18200, conv: 3.2 }, { d: 'W2', sessions: 20400, conv: 3.5 },
    { d: 'W3', sessions: 19100, conv: 3.3 }, { d: 'W4', sessions: 25500, conv: 4.1 },
  ],
  '90d': [
    { d: 'Aug', sessions: 61000, conv: 3.0 }, { d: 'Sep', sessions: 72400, conv: 3.6 },
    { d: 'Oct', sessions: 83200, conv: 3.9 },
  ],
} as const
type Period = keyof typeof periods

const period = ref<Period>('30d')
const focused = ref<number | null>(null)
const data = computed(() => periods[period.value])
const active = computed(() => (focused.value == null ? null : data.value[focused.value]))

const total = computed(() => data.value.reduce((s, r) => s + r.sessions, 0))
const avgConv = computed(() => data.value.reduce((s, r) => s + r.conv, 0) / data.value.length)
const delta = computed(() => {
  const rows = data.value
  const half = Math.floor(rows.length / 2)
  const prev = rows.slice(0, half).reduce((s, r) => s + r.sessions, 0) / half
  const next = rows.slice(half).reduce((s, r) => s + r.sessions, 0) / (rows.length - half)
  return ((next - prev) / prev) * 100
})
</script>
<template>
  <OCard class="w-full max-w-2xl gap-5 p-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <div class="text-sm font-medium text-ousi-muted">
          {{ active ? \`Sessions · \${active.d}\` : 'Traffic & conversion' }}
        </div>
        <div class="mt-2 flex items-baseline gap-3">
          <OAnimatedNumber
            :value="active ? active.sessions : total"
            animation="count"
            class="text-3xl font-semibold tabular-nums text-ousi-foreground"
          />
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium tabular-nums"
            :class="delta >= 0 ? 'bg-ousi-success/15 text-ousi-success-soft-strong' : 'bg-ousi-danger/15 text-ousi-danger-soft-strong'"
          >
            {{ delta >= 0 ? '+' : '' }}{{ delta.toFixed(1) }}%
          </span>
        </div>
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="p in (Object.keys(periods) as Period[])"
          :key="p"
          type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="period === p ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="period = p"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <OComboChart
      v-model:focused="focused"
      :data="data"
      category-key="d"
      :height="240"
      :tooltip="false"
      :bar="{ key: 'sessions', label: 'Sessions', color: 'var(--ousi-accent)' }"
      :line="{ key: 'conv', label: 'Conversion', color: 'var(--ousi-orange)', format: (v) => \`\${v}%\` }"
    />

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-2xl bg-ousi-default px-4 py-3">
        <div class="text-xs text-ousi-muted">Total sessions</div>
        <div class="mt-0.5 text-lg font-semibold tabular-nums text-ousi-foreground">{{ total.toLocaleString() }}</div>
      </div>
      <div class="rounded-2xl bg-ousi-default px-4 py-3">
        <div class="text-xs text-ousi-muted">Avg. conversion</div>
        <div class="mt-0.5 text-lg font-semibold tabular-nums text-ousi-foreground">{{ avgConv.toFixed(1) }}%</div>
      </div>
    </div>
  </OCard>
</template>`,
      },
    },
    {
      id: 'earnings',
      title: 'Recipe: earnings (bars only)',
      example: {
        component: 'ComboChartEarnings',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OComboChart } from '@ousi-ui/vue'

const ranges = ['Weekly', 'Monthly', 'Yearly'] as const
const sets = {
  Weekly: { delta: 14.8, rows: [
    { l: 'Mon', v: 820 }, { l: 'Tue', v: 1140 }, { l: 'Wed', v: 960 }, { l: 'Thu', v: 1480 },
    { l: 'Fri', v: 1320 }, { l: 'Sat', v: 1050 }, { l: 'Sun', v: 692 },
  ] },
  Monthly: { delta: 9.2, rows: [
    { l: 'W1', v: 6200 }, { l: 'W2', v: 7400 }, { l: 'W3', v: 6900 }, { l: 'W4', v: 8800 },
  ] },
  Yearly: { delta: 21.5, rows: [
    { l: 'Q1', v: 58000 }, { l: 'Q2', v: 71000 }, { l: 'Q3', v: 66000 }, { l: 'Q4', v: 92000 },
  ] },
} as const

const range = ref<(typeof ranges)[number]>('Weekly')
const focused = ref<number | null>(null)

const set = computed(() => sets[range.value])
const total = computed(() => set.value.rows.reduce((s, r) => s + r.v, 0))
const active = computed(() => (focused.value == null ? null : set.value.rows[focused.value]))
</script>
<template>
  <!-- The header is plain markup: change it however you like. -->
  <OCard class="w-full max-w-md gap-5 p-5">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-ousi-muted">
        {{ active ? \`Earned · \${active.l}\` : 'Earned so far' }}
      </span>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="r in ranges"
          :key="r"
          type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="range === r ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="range = r"
        >
          {{ r }}
        </button>
      </div>
    </div>

    <div class="flex items-baseline gap-3">
      <OAnimatedNumber locale="en-US"
        :value="active ? active.v : total"
        :format-options="{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }"
        animation="count"
        class="text-3xl font-semibold tabular-nums text-ousi-foreground"
      />
      <span class="rounded-full bg-ousi-success/15 px-2 py-0.5 text-xs font-medium tabular-nums text-ousi-success-soft-strong">
        +{{ set.delta }}%
      </span>
    </div>

    <OComboChart
      v-model:focused="focused"
      :data="set.rows"
      category-key="l"
      :height="200"
      :show-bar-axis="false"
      :tooltip="false"
      :bar="{ key: 'v', label: 'Earnings', color: 'var(--ousi-success)' }"
    />
  </OCard>
</template>`,
      },
    },
    {
      id: 'steps',
      title: 'Recipe: steps (week navigation)',
      example: {
        component: 'ComboChartSteps',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OComboChart } from '@ousi-ui/vue'

const weeks = [
  { period: '22 – 28 Jun', rows: [4200, 6100, 5400, 7800, 6600, 9200, 3800] },
  { period: '29 Jun – 5 Jul', rows: [3800, 5200, 4700, 5900, 6400, 3300, 2300] },
  { period: '6 – 12 Jul', rows: [5100, 6800, 7200, 6400, 8100, 10400, 6900] },
]
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const week = ref(1)

const data = computed(() => weeks[week.value].rows.map((v, i) => ({ d: days[i], v })))
const total = computed(() => weeks[week.value].rows.reduce((s, v) => s + v, 0))
</script>
<template>
  <OCard class="w-full max-w-md gap-5 p-5">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-ousi-muted">Steps</span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="grid size-7 place-items-center rounded-full bg-ousi-default text-ousi-foreground disabled:opacity-40"
          :disabled="week === 0"
          aria-label="Previous week"
          @click="week--"
        >
          <svg viewBox="0 0 12 12" class="size-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 3 4.5 6l3 3" /></svg>
        </button>
        <span class="min-w-24 text-center text-xs font-medium tabular-nums text-ousi-foreground">{{ weeks[week].period }}</span>
        <button
          type="button"
          class="grid size-7 place-items-center rounded-full bg-ousi-default text-ousi-foreground disabled:opacity-40"
          :disabled="week === weeks.length - 1"
          aria-label="Next week"
          @click="week++"
        >
          <svg viewBox="0 0 12 12" class="size-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3 7.5 6l-3 3" /></svg>
        </button>
      </div>
    </div>

    <div class="flex items-baseline gap-2">
      <OAnimatedNumber :value="total" animation="count" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
      <span class="text-sm text-ousi-muted">total steps</span>
    </div>

    <OComboChart
      :data="data"
      category-key="d"
      :height="200"
      :show-bar-axis="false"
      :bar-gap="0.5"
      :bar="{ key: 'v', label: 'Steps', color: 'var(--ousi-accent)' }"
    />
  </OCard>
</template>`,
      },
    },
    {
      id: 'tooltip',
      title: 'Custom tooltip',
      example: {
        component: 'ComboChartTooltip',
        code: `<script setup lang="ts">
import { OComboChart } from '@ousi-ui/vue'

const data = [
  { month: 'Jan', orders: 420, aov: 38 }, { month: 'Feb', orders: 510, aov: 41 },
  { month: 'Mar', orders: 480, aov: 39 }, { month: 'Apr', orders: 640, aov: 46 },
  { month: 'May', orders: 720, aov: 49 }, { month: 'Jun', orders: 690, aov: 47 },
]
</script>
<template>
  <!-- The tooltip slot receives the resolved point: category, bar, line, datum and x position. -->
  <OComboChart
    :data="data"
    category-key="month"
    :bar="{ key: 'orders', label: 'Orders', color: 'var(--ousi-violet)' }"
    :line="{ key: 'aov', label: 'Avg. order', color: 'var(--ousi-success)', format: (v) => \`$\${v}\` }"
  >
    <template #tooltip="{ point }">
      <div class="w-40">
        <div class="text-[11px] uppercase tracking-wide text-ousi-muted">{{ point.category }}</div>
        <div class="mt-1 text-lg font-semibold tabular-nums text-ousi-foreground">
          \${{ (point.bar.value * (point.line?.value ?? 0)).toLocaleString() }}
        </div>
        <div class="text-xs text-ousi-muted">estimated revenue</div>
        <div class="mt-2 flex justify-between text-xs tabular-nums">
          <span :style="{ color: point.bar.color }">{{ point.bar.formatted }} orders</span>
          <span :style="{ color: point.line?.color }">{{ point.line?.formatted }}</span>
        </div>
      </div>
    </template>
  </OComboChart>
</template>`,
      },
    },
    {
      id: 'events',
      title: 'Events',
      example: {
        component: 'ComboChartEvents',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OComboChart } from '@ousi-ui/vue'
import type { ComboChartPoint } from '@ousi-ui/vue'

const data = [
  { month: 'Jan', sessions: 8200, conversion: 2.9 }, { month: 'Feb', sessions: 9100, conversion: 3.1 },
  { month: 'Mar', sessions: 8700, conversion: 3.0 }, { month: 'Apr', sessions: 10400, conversion: 3.6 },
  { month: 'May', sessions: 11800, conversion: 3.9 }, { month: 'Jun', sessions: 12600, conversion: 4.2 },
]

const log = ref<string[]>([])
const selected = ref<ComboChartPoint | null>(null)
const push = (m: string) => { log.value = [m, ...log.value].slice(0, 4) }
</script>
<template>
  <div class="flex flex-col gap-4">
    <OComboChart
      :data="data"
      category-key="month"
      :height="220"
      :tooltip="false"
      :bar="{ key: 'sessions', label: 'Sessions' }"
      :line="{ key: 'conversion', label: 'Conversion', format: (v) => \`\${v}%\` }"
      @point-enter="(p) => push(\`enter · \${p.category}\`)"
      @point-leave="(p) => push(\`leave · \${p.category}\`)"
      @point-click="(p) => { selected = p; push(\`click · \${p.category}\`) }"
    />
    <div class="flex flex-wrap items-start justify-between gap-4 text-xs">
      <ul class="min-h-16 space-y-1 font-mono text-ousi-muted">
        <li v-if="!log.length">Hover or click a category…</li>
        <li v-for="(l, i) in log" :key="\`\${i}-\${l}\`" :class="i === 0 && 'text-ousi-foreground'">{{ l }}</li>
      </ul>
      <div v-if="selected" class="rounded-xl bg-ousi-default px-4 py-3">
        <div class="text-ousi-muted">Selected</div>
        <div class="text-base font-semibold text-ousi-foreground">{{ selected.category }}</div>
        <div class="tabular-nums text-ousi-muted">{{ selected.bar.formatted }} · {{ selected.line?.formatted }}</div>
      </div>
    </div>
  </div>
</template>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled focus',
      example: {
        component: 'ComboChartControlled',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OComboChart } from '@ousi-ui/vue'

const data = [
  { month: 'Jan', sessions: 8200, conversion: 2.9 }, { month: 'Feb', sessions: 9100, conversion: 3.1 },
  { month: 'Mar', sessions: 8700, conversion: 3.0 }, { month: 'Apr', sessions: 10400, conversion: 3.6 },
  { month: 'May', sessions: 11800, conversion: 3.9 }, { month: 'Jun', sessions: 12600, conversion: 4.2 },
]
const focused = ref<number | null>(null)

const best = data.reduce((b, r, i) => (r.sessions > data[b].sessions ? i : b), 0)
const worst = data.reduce((b, r, i) => (r.sessions < data[b].sessions ? i : b), 0)
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-2">
      <OButton size="sm" :variant="focused === best ? 'primary' : 'secondary'" @click="focused = focused === best ? null : best">
        Best month
      </OButton>
      <OButton size="sm" :variant="focused === worst ? 'primary' : 'secondary'" @click="focused = focused === worst ? null : worst">
        Weakest month
      </OButton>
    </div>
    <!-- v-model:focused is two-way: buttons drive the chart, hovering drives the buttons. -->
    <OComboChart
      v-model:focused="focused"
      :data="data"
      category-key="month"
      :height="220"
      :bar="{ key: 'sessions', label: 'Sessions' }"
      :line="{ key: 'conversion', label: 'Conversion', format: (v) => \`\${v}%\` }"
    />
  </div>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'ComboChartVariants',
        code: `<script setup lang="ts">
import { OComboChart } from '@ousi-ui/vue'

const data = [
  { d: 'Mon', visits: 320, rate: 12 }, { d: 'Tue', visits: 410, rate: 18 },
  { d: 'Wed', visits: 380, rate: 15 }, { d: 'Thu', visits: 520, rate: 24 },
  { d: 'Fri', visits: 610, rate: 28 }, { d: 'Sat', visits: 290, rate: 14 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Bars only</p>
      <OComboChart :data="data" category-key="d" :height="180" :bar="{ key: 'visits', label: 'Visits', color: 'var(--ousi-violet)' }" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Linear curve, top-rounded bars, no points</p>
      <OComboChart
        :data="data" category-key="d" :height="180" curve="linear" bar-corners="top" :bar-radius="6" :bar-gap="0.2" :show-points="false"
        :bar="{ key: 'visits', label: 'Visits' }"
        :line="{ key: 'rate', label: 'Rate', format: (v) => \`\${v}%\` }"
      />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Thin bars, no grid, no value axes</p>
      <OComboChart
        :data="data" category-key="d" :height="180" :grid="false" :show-bar-axis="false" :show-line-axis="false" :bar-gap="0.7" :bar-radius="10"
        :bar="{ key: 'visits', label: 'Visits', color: 'var(--ousi-success)' }"
        :line="{ key: 'rate', label: 'Rate', color: 'var(--ousi-danger)', format: (v) => \`\${v}%\` }"
      />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Static (not interactive)</p>
      <OComboChart
        :data="data" category-key="d" :height="180" :interactive="false"
        :bar="{ key: 'visits', label: 'Visits', color: '#0ea5e9' }"
        :line="{ key: 'rate', label: 'Rate', color: '#f43f5e', format: (v) => \`\${v}%\` }"
      />
    </div>
    <div class="md:col-span-2">
      <p class="mb-2 text-xs text-ousi-muted">Compact: no axes, no grid</p>
      <OComboChart
        :data="data" category-key="d" :height="110" :grid="false"
        :show-x-axis="false" :show-bar-axis="false" :show-line-axis="false"
        :bar="{ key: 'visits', label: 'Visits', color: 'var(--ousi-violet)' }"
        :line="{ key: 'rate', label: 'Rate', color: 'var(--ousi-orange)', format: (v) => \`\${v}%\` }"
      />
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'Record<string, unknown>[]', description: 'One row per category.' },
    { name: 'categoryKey', type: 'string', description: 'Field holding the category label.' },
    { name: 'bar', type: 'ComboChartSeries', description: 'Bar series on the left axis: { key, label?, color?, format? }.' },
    { name: 'line', type: 'ComboChartSeries', default: '-', description: 'Optional line series on the right axis, same shape as bar.' },
    { name: 'height', type: 'number', default: '260', description: 'Chart height in px. Width is fluid.' },
    { name: 'grid', type: 'boolean', default: 'true', description: 'Show horizontal grid lines.' },
    { name: 'curve', type: "'smooth' | 'linear'", default: "'smooth'", description: 'Line interpolation.' },
    { name: 'barRadius', type: 'number', default: '10', description: 'Corner radius of the bars in px (capped to half the bar width).' },
    { name: 'barCorners', type: "'top' | 'all'", default: "'all'", description: 'Round only the top corners or every corner of the bars.' },
    { name: 'showXAxis', type: 'boolean', default: 'true', description: 'Show the category labels under the plot.' },
    { name: 'showBarAxis', type: 'boolean', default: 'true', description: 'Show the left axis labels (bar series).' },
    { name: 'showLineAxis', type: 'boolean', default: 'true', description: 'Show the right axis labels (line series).' },
    { name: 'showPoints', type: 'boolean', default: 'true', description: 'Show a dot on the line at every category.' },
    { name: 'barGap', type: 'number', default: '0.4', description: 'Space between bars as a fraction of the band (0-0.9).' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions and their events.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'Show the built-in tooltip.' },
    { name: 'focused', type: 'number | null', default: 'null', description: 'Index of the highlighted category. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount and data changes. Respects prefers-reduced-motion.' },
    { name: 'padding', type: 'ComboChartPadding', default: '-', description: 'Plot spacing in px ({ top, right, bottom, left }); increase it for wider axis labels.' },
    { name: 'label', type: 'string', default: '-', description: 'Accessible label.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'tooltip', type: '{ point: ComboChartPoint }', description: 'Replaces the tooltip content. point has index, category, datum, bar, line and x.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted category changed (v-model:focused).' },
    { name: 'point-enter', type: '(point: ComboChartPoint, event: Event)', description: 'Pointer or keyboard focus enters a category.' },
    { name: 'point-leave', type: '(point: ComboChartPoint, event: Event)', description: 'Pointer or keyboard focus leaves a category.' },
    { name: 'point-click', type: '(point: ComboChartPoint, event: Event)', description: 'A category is clicked or activated with Enter/Space.' },
  ],


  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between categories.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],

  aria: [
    { attribute: 'role="group"', condition: 'always', description: 'Groups the chart with an accessible label.' },
    { attribute: 'aria-label', condition: 'per category', description: 'Each category announces its label and both values.' },
  ],
}
