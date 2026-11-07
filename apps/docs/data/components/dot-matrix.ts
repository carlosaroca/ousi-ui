import type { ComponentData } from './types'

export const dotMatrixData: ComponentData = {
  title: 'Dot Matrix',
  description: 'A bar chart drawn with dots: every column fills from the bottom. Fade columns with scale to mark a forecast.',
  category: 'Charts',
  importCode: "import { ODotMatrix } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DotMatrixBasic',
        code: `<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

// Each column fills from the bottom: 5 dots, so a value of 60 of 100 lights 3 dots.
const rand = (s: number) => { const x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 24 }, (_, i) => ({
  label: \`Day \${i + 1}\`,
  value: Math.round(8 + rand(i + 3) * 92),
}))
</script>
<template>
  <ODotMatrix :data="data" :max="100" color="violet" :dot-size="18" />
</template>`,
      },
    },
    {
      id: 'kpis',
      title: 'KPI cards that react to hover',
      example: {
        component: 'DotMatrixKpiCards',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODotMatrix } from '@ousi-ui/vue'

// KPI cards: hover a column and the value and the change switch to that day, animated.
const rand = (s: number) => { const x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x) }
const make = (seed: number, lo: number, hi: number, last: number, n = 16) =>
  Array.from({ length: n }, (_, i) => ({
    label: \`Day \${i + 1}\`,
    value: i === n - 1 ? last : Math.round(lo + rand(seed + i) * (hi - lo)),
  }))

const cards = [
  { label: 'Appointments today', color: '#38b2d8', icon: 'calendar', data: make(3, 18, 70, 48), delta: 8, percent: true, invert: false, prefix: '' },
  { label: 'Waiting now', color: '#f08a3c', icon: 'hourglass', data: make(17, 1, 12, 6), delta: -3, percent: false, invert: true, prefix: '' },
  { label: 'Unsigned notes', color: '#8b6cf0', icon: 'pen', data: make(29, 0, 9, 5), delta: 2, percent: false, invert: true, prefix: '' },
]

const focused = ref<(number | null)[]>(cards.map(() => null))

const view = computed(() =>
  cards.map((c, i) => {
    const h = focused.value[i]
    if (h == null) return { value: c.data[c.data.length - 1].value, delta: c.delta, day: '' }
    const prev = c.data[h - 1]?.value ?? c.data[h].value
    const diff = c.data[h].value - prev
    // Percent cards show the relative change; the others the difference in units
    const delta = c.percent ? (prev ? Math.round((diff / prev) * 100) : 0) : diff
    return { value: c.data[h].value, delta, day: c.data[h].label }
  }),
)
const good = (i: number) => (cards[i].invert ? view.value[i].delta <= 0 : view.value[i].delta >= 0)
const max = (i: number) => Math.max(...cards[i].data.map((d) => d.value), 1)
</script>
<template>
  <div class="grid gap-4 md:grid-cols-3">
    <OCard v-for="(c, i) in cards" :key="c.label" class="gap-3 p-4">
      <div class="flex items-center gap-3">
        <div class="grid size-8 shrink-0 place-items-center rounded-lg" :style="{ backgroundColor: \`color-mix(in srgb, \${c.color} 14%, transparent)\`, color: c.color }">
          <svg v-if="c.icon === 'calendar'" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
          <svg v-else-if="c.icon === 'hourglass'" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" /></svg>
          <svg v-else viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1zM14 7l3 3" /></svg>
        </div>
        <span class="min-w-0 truncate text-xs text-ousi-muted">{{ c.label }}</span>
        <span class="ml-auto shrink-0 text-[11px] tabular-nums text-ousi-muted">{{ view[i].day }}</span>
      </div>

      <div class="flex items-baseline justify-between">
        <OAnimatedNumber :value="view[i].value" animation="count" :duration="300" class="text-2xl font-semibold tabular-nums tracking-tight text-ousi-foreground" />
        <span class="flex items-center gap-1 text-xs font-medium tabular-nums" :class="good(i) ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
          <svg viewBox="0 0 12 12" class="size-2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path v-if="view[i].delta >= 0" d="M3 9l6-6M4 3h5v5" /><path v-else d="M3 3l6 6M9 4v5H4" />
          </svg>
          <OAnimatedNumber
            :value="view[i].delta"
            :format-options="{ signDisplay: 'exceptZero', maximumFractionDigits: 0 }"
            :suffix="c.percent ? '%' : ''"
            animation="count"
            :duration="300"
          />
        </span>
      </div>

      <!-- Each card keeps its own focus: the column under the pointer drives the numbers above -->
      <ODotMatrix v-model:focused="focused[i]" :data="c.data" :max="max(i)" :color="c.color" :dot-size="14" :gap="5" align="start" :tooltip="false" />
    </OCard>
  </div>
</template>`,
      },
    },
    {
      id: 'forecast',
      title: 'Fading columns (forecast)',
      example: {
        component: 'DotMatrixForecast',
        code: `<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

// \`scale\` shrinks a whole column: handy for an unfinished period or a forecast.
const rand = (s: number) => { const x = Math.sin(s * 78.233) * 43758.5453; return x - Math.floor(x) }
const N = 26
const data = Array.from({ length: N }, (_, i) => ({
  label: \`Week \${i + 1}\`,
  value: Math.round(30 + rand(i + 9) * 70),
  scale: i < N - 8 ? 1 : Math.max(0, 1 - (i - (N - 9)) * 0.14),
}))
</script>
<template>
  <ODotMatrix :data="data" :max="100" color="#f2b93b" :dot-size="18" partial />
</template>`,
      },
    },
    {
      id: 'shapes',
      title: 'Shapes, rows and gaps',
      example: {
        component: 'DotMatrixShapes',
        code: `<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

const rand = (s: number) => { const x = Math.sin(s * 91.7) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 16 }, (_, i) => ({ label: \`#\${i + 1}\`, value: Math.round(10 + rand(i + 1) * 90) }))
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div><p class="mb-2 text-xs text-ousi-muted">circle (default)</p><ODotMatrix :data="data" :max="100" color="accent" :dot-size="14" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">rounded</p><ODotMatrix :data="data" :max="100" color="success" shape="rounded" :dot-size="14" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">square, 8 rows, tight gap</p><ODotMatrix :data="data" :max="100" color="orange" shape="square" :rows="8" :gap="3" :dot-size="12" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">3 rows, partial dots, strong empty color</p><ODotMatrix :data="data" :max="100" color="danger" :rows="3" partial empty-color="color-mix(in srgb, var(--ousi-foreground) 14%, transparent)" :dot-size="18" /></div>
  </div>
</template>`,
      },
    },
    {
      id: 'hover',
      title: 'Recipe: header reacts to hover',
      example: {
        component: 'DotMatrixHover',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODotMatrix } from '@ousi-ui/vue'

const rand = (s: number) => { const x = Math.sin(s * 45.164) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 30 }, (_, i) => ({ label: \`Jun \${i + 1}\`, value: Math.round(1200 + rand(i + 5) * 3800) }))
const focused = ref<number | null>(null)
const active = computed(() => (focused.value == null ? null : data[focused.value]))
const total = data.reduce((s, d) => s + d.value, 0)
</script>
<template>
  <OCard class="w-full max-w-2xl gap-5 p-5">
    <div>
      <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Daily active users · June' }}</div>
      <OAnimatedNumber :value="active ? active.value : total" animation="count" :duration="250" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
    </div>
    <!-- v-model:focused keeps the header in sync; the built-in tooltip is turned off -->
    <ODotMatrix v-model:focused="focused" :data="data" :max="5000" color="violet" :dot-size="16" :tooltip="false" />
  </OCard>
</template>`,
      },
    },
    {
      id: 'categories',
      title: 'Colors per column and labels',
      example: {
        component: 'DotMatrixCategories',
        code: `<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

// Every column can set its own color, and labels go under the matrix.
const data = [
  { label: 'Mon', value: 62, color: 'accent' }, { label: 'Tue', value: 88, color: 'accent' },
  { label: 'Wed', value: 45, color: 'accent' }, { label: 'Thu', value: 95, color: 'success' },
  { label: 'Fri', value: 71, color: 'accent' }, { label: 'Sat', value: 30, color: 'orange' },
  { label: 'Sun', value: 18, color: 'orange' },
]
</script>
<template>
  <div class="max-w-md">
    <ODotMatrix :data="data" :max="100" :rows="6" :dot-size="26" :gap="10" show-labels :format-value="(v) => \`\${v} pts\`" />
    <p class="mt-3 text-xs text-ousi-muted"><span class="text-ousi-success-soft-strong">Green</span>: best day · <span class="text-ousi-orange-soft-strong">orange</span>: weekend</p>
  </div>
</template>`,
      },
    },
    {
      id: 'tooltip',
      title: 'Custom tooltip',
      example: {
        component: 'DotMatrixTooltip',
        code: `<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

const rand = (s: number) => { const x = Math.sin(s * 23.17) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 20 }, (_, i) => ({ label: \`Sprint \${i + 1}\`, value: Math.round(20 + rand(i + 2) * 80) }))
</script>
<template>
  <ODotMatrix :data="data" :max="100" color="success" :dot-size="16">
    <template #tooltip="{ item }">
      <div class="w-36">
        <div class="text-[11px] uppercase tracking-wide text-ousi-muted">{{ item.label }}</div>
        <div class="mt-0.5 text-lg font-semibold tabular-nums text-ousi-foreground">{{ item.percent }}%</div>
        <div class="text-xs text-ousi-muted">of the goal · {{ item.filled }}/5 dots</div>
        <div class="mt-1 text-xs font-medium" :style="{ color: item.percent >= 70 ? 'var(--ousi-success)' : 'var(--ousi-warning)' }">
          {{ item.percent >= 70 ? 'On track' : 'Behind' }}
        </div>
      </div>
    </template>
  </ODotMatrix>
</template>`,
      },
    },
    {
      id: 'events',
      title: 'Events',
      example: {
        component: 'DotMatrixEvents',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { ODotMatrix } from '@ousi-ui/vue'
import type { DotMatrixItem } from '@ousi-ui/vue'

const rand = (s: number) => { const x = Math.sin(s * 61.3) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 18 }, (_, i) => ({ label: \`Day \${i + 1}\`, value: Math.round(10 + rand(i + 7) * 90) }))
const picked = ref<DotMatrixItem[]>([])
function toggle(it: DotMatrixItem) {
  picked.value = picked.value.some((p) => p.index === it.index) ? picked.value.filter((p) => p.index !== it.index) : [...picked.value, it]
}
const avg = () => (picked.value.length ? Math.round(picked.value.reduce((s, p) => s + p.value, 0) / picked.value.length) : 0)
</script>
<template>
  <div class="flex flex-col gap-4">
    <ODotMatrix :data="data" :max="100" color="accent" :dot-size="16" @column-click="toggle" />
    <p class="text-xs text-ousi-muted">
      Click columns to select them ·
      <b class="tabular-nums text-ousi-foreground">{{ picked.length }}</b> selected, average
      <b class="tabular-nums text-ousi-foreground">{{ avg() }}</b>
      <span v-if="picked.length"> · {{ picked.map((p) => p.label).join(', ') }}</span>
    </p>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'data', type: 'DotMatrixDatum[]', description: 'Columns: { label?, value, scale?, color? }.' },
    { name: 'rows', type: 'number', default: '5', description: 'Dots per column.' },
    { name: 'max', type: 'number', default: 'largest value', description: 'Value that fills a whole column.' },
    { name: 'color', type: 'string', default: '\'accent\'', description: 'Token name or any CSS color of the filled dots.' },
    { name: 'emptyColor', type: 'string', default: '\'var(--ousi-default)\'', description: 'Color of the empty dots.' },
    { name: 'shape', type: '\'circle\' | \'rounded\' | \'square\'', default: '\'circle\'', description: 'Dot shape.' },
    { name: 'dotSize', type: 'number', default: '16', description: 'Largest dot diameter in px. Dots shrink to fit the width.' },
    { name: 'gap', type: 'number', default: '8', description: 'Space between dots in px. It shrinks (to at most 60% of a dot) when the width is tight, so dots stay readable.' },
    { name: 'partial', type: 'boolean', default: 'false', description: 'Draw the last filled dot proportionally to the remainder.' },
    { name: 'align', type: '\'start\' | \'center\'', default: '\'center\'', description: 'Placement when the matrix does not use the full width.' },
    { name: 'showLabels', type: 'boolean', default: 'false', description: 'Show the column labels under the matrix.' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Formats values in the tooltip.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'Show the built-in tooltip.' },
    { name: 'focused', type: 'number | null', default: 'null', description: 'Highlighted column index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount. Respects prefers-reduced-motion.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'tooltip', type: '{ item }', description: 'Replaces the tooltip content. item has index, label, value, filled, percent, color, formatted and datum.' },
  ],

  emits: [
    { name: 'update:focused', type: '(index: number | null)', description: 'Highlighted column changed (v-model:focused).' },
    { name: 'column-enter', type: '(item: DotMatrixItem, event: Event)', description: 'Pointer or keyboard focus enters a column.' },
    { name: 'column-leave', type: '(item: DotMatrixItem, event: Event)', description: 'Pointer or keyboard focus leaves a column.' },
    { name: 'column-click', type: '(item: DotMatrixItem, event: Event)', description: 'A column is clicked or activated with Enter/Space.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Moves between columns.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
