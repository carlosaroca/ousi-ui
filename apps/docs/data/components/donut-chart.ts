import type { ComponentData } from './types'

export const donutChartData: ComponentData = {
  title: 'Donut Chart',
  description: 'Share of a total split into segments. Donut or pie, with a center that reacts to hover, an optional legend and rounded segments.',
  category: 'Charts',
  importCode: "import { ODonutChart } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DonutChartBasic',
        code: `<script setup lang="ts">
import { ODonutChart } from '@ousi-ui/vue'

const data = [
  { label: 'Direct', value: 4200, color: 'accent' },
  { label: 'Search', value: 3100, color: 'violet' },
  { label: 'Social', value: 1800, color: 'orange' },
  { label: 'Email', value: 900, color: 'success' },
]
</script>
<template>
  <ODonutChart :data="data" />
</template>`,
      },
    },
    {
      id: 'legend',
      title: 'Legend and rounded segments',
      example: {
        component: 'DonutChartLegend',
        code: `<script setup lang="ts">
import { ODonutChart } from '@ousi-ui/vue'

const data = [
  { label: 'Housing', value: 1400, color: '#4f8ff7' },
  { label: 'Food', value: 620, color: '#aee637' },
  { label: 'Transport', value: 280, color: '#b57bff' },
  { label: 'Leisure', value: 340, color: '#ec6fb5' },
  { label: 'Savings', value: 1360, color: '#f2b93b' },
]
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
</script>
<template>
  <!-- Hover a segment or a legend row: both highlight each other without any v-model -->
  <ODonutChart :data="data" :size="200" :thickness="11" :gap="4" rounded show-legend :format-value="(v) => usd.format(v)" class="w-72" />
</template>`,
      },
    },
    {
      id: 'center',
      title: 'Custom center',
      example: {
        component: 'DonutChartCenter',
        code: `<script setup lang="ts">
import { OAnimatedNumber, ODonutChart } from '@ousi-ui/vue'

const data = [
  { label: 'Completed', value: 64, color: 'success' },
  { label: 'In progress', value: 22, color: 'accent' },
  { label: 'Blocked', value: 9, color: 'danger' },
  { label: 'Not started', value: 5, color: '#9ca3af' },
]
</script>
<template>
  <!-- The default slot is the hole: it gets the total and the hovered segment -->
  <ODonutChart :data="data" :size="230" :thickness="15" :gap="3">
    <template #default="{ total, focusedItem }">
      <div class="text-center">
        <div class="flex items-baseline justify-center gap-0.5 text-4xl font-semibold tabular-nums text-ousi-foreground">
          <OAnimatedNumber :value="focusedItem ? focusedItem.percent : data[0].value" animation="count" :duration="300" :format-options="{ maximumFractionDigits: 0 }" />
          <span class="text-xl text-ousi-muted">%</span>
        </div>
        <div class="mt-0.5 text-xs" :style="{ color: focusedItem?.color }">{{ focusedItem ? focusedItem.label : 'Completed' }}</div>
        <div class="text-[11px] text-ousi-muted">{{ focusedItem ? \`\${focusedItem.value} of \${total}\` : \`\${total} tasks\` }}</div>
      </div>
    </template>
  </ODonutChart>
</template>`,
      },
    },
    {
      id: 'budget',
      title: 'Recipe: budget with period switch',
      example: {
        component: 'DonutChartBudget',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODonutChart } from '@ousi-ui/vue'
import type { DonutItem } from '@ousi-ui/vue'

const periods = {
  Monthly: [
    { label: 'Housing', value: 1400, color: '#4f8ff7' }, { label: 'Food', value: 620, color: '#aee637' },
    { label: 'Transport', value: 280, color: '#b57bff' }, { label: 'Leisure', value: 340, color: '#ec6fb5' },
    { label: 'Savings', value: 1360, color: '#f2b93b' },
  ],
  Yearly: [
    { label: 'Housing', value: 16800, color: '#4f8ff7' }, { label: 'Food', value: 7600, color: '#aee637' },
    { label: 'Transport', value: 3900, color: '#b57bff' }, { label: 'Leisure', value: 5200, color: '#ec6fb5' },
    { label: 'Savings', value: 16300, color: '#f2b93b' },
  ],
} as const
type Period = keyof typeof periods

const period = ref<Period>('Monthly')
const focused = ref<number | null>(null)
const data = computed(() => periods[period.value])
const total = computed(() => data.value.reduce((s, d) => s + d.value, 0))
const active = computed(() => (focused.value == null ? null : data.value[focused.value]))
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Spending' }}</div>
        <OAnimatedNumber locale="en-US" :value="active ? active.value : total" :format-options="usd" animation="count" :duration="300" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="(_, p) in periods" :key="p" type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="period === p ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="period = p as Period"
        >{{ p }}</button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-6">
      <ODonutChart v-model:focused="focused" :data="data" :size="180" :thickness="14" :gap="3" rounded>
        <template #default="{ focusedItem }">
          <div class="text-center">
            <div class="text-2xl font-semibold tabular-nums text-ousi-foreground">{{ focusedItem ? \`\${focusedItem.percent}%\` : '100%' }}</div>
            <div class="text-xs text-ousi-muted">{{ focusedItem ? focusedItem.label : 'of income' }}</div>
          </div>
        </template>
      </ODonutChart>

      <!-- Custom legend rows with a progress bar; they share the focus with the chart -->
      <ul class="min-w-48 flex-1 space-y-2.5">
        <li
          v-for="(d, i) in data" :key="d.label"
          class="cursor-default transition-opacity" :class="focused != null && focused !== i && 'opacity-40'"
          @mouseenter="focused = i" @mouseleave="focused = null"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="flex items-center gap-2 text-ousi-foreground"><span class="inline-block size-2.5 rounded-full" :style="{ backgroundColor: d.color }" />{{ d.label }}</span>
            <span class="tabular-nums text-ousi-muted">{{ d.value.toLocaleString('en-US', usd) }}</span>
          </div>
          <div class="mt-1 h-1 overflow-hidden rounded-full bg-ousi-default">
            <div class="h-full rounded-full transition-all duration-500" :style="{ width: \`\${(d.value / total) * 100}%\`, backgroundColor: d.color }" />
          </div>
        </li>
      </ul>
    </div>
  </OCard>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'DonutChartVariants',
        code: `<script setup lang="ts">
import { ODonutChart } from '@ousi-ui/vue'

const data = [
  { label: 'A', value: 45, color: 'accent' },
  { label: 'B', value: 30, color: 'violet' },
  { label: 'C', value: 15, color: 'orange' },
  { label: 'D', value: 10, color: 'success' },
]
</script>
<template>
  <div class="flex flex-wrap items-center gap-10">
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" /><span class="text-xs text-ousi-muted">donut</span></div>
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" :thickness="8" :gap="3" rounded /><span class="text-xs text-ousi-muted">thin, rounded</span></div>
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" :thickness="30" :gap="1" /><span class="text-xs text-ousi-muted">thick</span></div>
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" variant="pie" :gap="1" /><span class="text-xs text-ousi-muted">pie</span></div>
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" :explode="0" :interactive="false" /><span class="text-xs text-ousi-muted">static</span></div>
  </div>
</template>`,
      },
    },
    {
      id: 'events',
      title: 'Events',
      example: {
        component: 'DonutChartEvents',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { ODonutChart } from '@ousi-ui/vue'
import type { DonutItem } from '@ousi-ui/vue'

const data = [
  { label: 'Chrome', value: 64, color: 'accent' }, { label: 'Safari', value: 19, color: 'violet' },
  { label: 'Edge', value: 6, color: 'success' }, { label: 'Firefox', value: 4, color: 'orange' },
  { label: 'Other', value: 7, color: '#9ca3af' },
]
const selected = ref<DonutItem | null>(null)
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <ODonutChart :data="data" :size="190" show-legend class="w-64" @segment-click="(s) => (selected = selected?.key === s.key ? null : s)" />
    <div class="min-w-48 rounded-xl bg-ousi-default px-4 py-3 text-xs">
      <div class="text-ousi-muted">Click a segment</div>
      <div v-if="selected" class="mt-1">
        <div class="flex items-center gap-2 text-base font-semibold text-ousi-foreground">
          <span class="inline-block size-2.5 rounded-full" :style="{ backgroundColor: selected.color }" />{{ selected.label }}
        </div>
        <div class="tabular-nums text-ousi-muted">{{ selected.formatted }} users · {{ selected.percent }}%</div>
      </div>
    </div>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'DonutDatum[]', description: 'Segments: { id?, label, value, color? }.' },
    { name: 'variant', type: '\'donut\' | \'pie\'', default: '\'donut\'', description: 'Leave a hole in the middle or fill it.' },
    { name: 'size', type: 'number', default: '220', description: 'Diameter in px.' },
    { name: 'thickness', type: 'number', default: '16', description: 'Ring thickness (0-100 viewBox scale). Ignored by pie.' },
    { name: 'gap', type: 'number', default: '2', description: 'Gap between segments in degrees.' },
    { name: 'rounded', type: 'boolean', default: 'false', description: 'Round the ends of every segment. Works best with a gap of 3 degrees or more.' },
    { name: 'explode', type: 'number', default: '3', description: 'How far the hovered segment moves outward (viewBox units).' },
    { name: 'showLegend', type: 'boolean', default: 'false', description: 'Show a legend under the chart.' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Formats values.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'focused', type: 'number | null', default: 'null', description: 'Highlighted segment index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount. Respects prefers-reduced-motion.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: '{ total, formattedTotal, focusedItem }', description: 'Center of the donut.' },
    { name: 'legend', type: '{ item, focused, dimmed }', description: 'Content of each legend row.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted segment changed (v-model:focused).' },
    { name: 'segment-enter', type: '(item: DonutItem, event: Event)', description: 'Pointer or keyboard focus enters a segment.' },
    { name: 'segment-leave', type: '(item: DonutItem, event: Event)', description: 'Pointer or keyboard focus leaves a segment.' },
    { name: 'segment-click', type: '(item: DonutItem, event: Event)', description: 'A segment is clicked or activated with Enter/Space.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between segments.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
