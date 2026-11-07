import type { ComponentData } from './types'

export const heatmapData: ComponentData = {
  title: 'Heatmap',
  description: 'A matrix of cells whose intensity follows the value, such as weekday by hour. Plain CSS grid, no charting library.',
  category: 'Charts',
  importCode: "import { OHeatmap } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'HeatmapBasic',
        code: `<script setup lang="ts">
import { OHeatmap } from '@ousi-ui/vue'

const columns = ['6a', '9a', '12p', '3p', '6p', '9p']
const rows = [
  { label: 'Mon', values: [12, 48, 62, 55, 38, 14] },
  { label: 'Tue', values: [10, 52, 70, 61, 40, 18] },
  { label: 'Wed', values: [14, 55, 74, 66, 44, 20] },
  { label: 'Thu', values: [11, 50, 68, 72, 46, 22] },
  { label: 'Fri', values: [9, 44, 60, 58, 52, 34] },
  { label: 'Sat', values: [4, 18, 30, 36, 42, 40] },
  { label: 'Sun', values: [3, 12, 22, 28, 30, 24] },
]
</script>
<template>
  <OHeatmap :rows="rows" :columns="columns" show-legend />
</template>`,
      },
    },
    {
      id: 'contributions',
      title: 'Calendar with levels and tooltip',
      example: {
        component: 'HeatmapContributions',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OHeatmap } from '@ousi-ui/vue'

// Contribution calendar: 7 weekday rows, one column per week, discrete levels and a tooltip.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const rand = (seed: number) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }

const ranges = { 'Last 12 weeks': 12, 'Last 6 months': 26, Year: 52 } as const
type Range = keyof typeof ranges
const range = ref<Range>('Year')

const START = new Date(2025, 0, 1)
const dateOf = (week: number, day: number) => new Date(START.getTime() + (week * 7 + day) * 86400000)
const valueOf = (week: number, day: number) => {
  const r = rand(week * 7 + day + 1)
  return r < 0.3 ? 0 : Math.round(r * r * 14)
}

const weeks = computed(() => ranges[range.value])
const offset = computed(() => 52 - weeks.value)

const rows = computed(() =>
  Array.from({ length: 7 }, (_, day) => ({
    label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day],
    values: Array.from({ length: weeks.value }, (_, w) => valueOf(w + offset.value, day)),
  })),
)
// Month name only on the first column of each month
const columns = computed(() =>
  Array.from({ length: weeks.value }, (_, w) => {
    const d = dateOf(w + offset.value, 0)
    const prev = w === 0 ? null : dateOf(w - 1 + offset.value, 0)
    return !prev || prev.getMonth() !== d.getMonth() ? MONTHS[d.getMonth()] : ''
  }),
)
const total = computed(() => rows.value.reduce((s, r) => s + r.values.reduce((a, b) => a + b, 0), 0))

function describe(cell: { row: number; col: number; value: number }) {
  const d = dateOf(cell.col + offset.value, cell.row)
  const day = \`\${MONTHS[d.getMonth()]} \${d.getDate()}\`
  return cell.value === 0 ? \`No contributions on \${day}\` : \`\${cell.value} contribution\${cell.value > 1 ? 's' : ''} on \${day}\`
}
</script>
<template>
  <OCard class="w-full max-w-3xl gap-4 p-5">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm font-medium text-ousi-muted">Activity</div>
        <div class="text-xs tabular-nums text-ousi-muted"><span class="font-semibold text-ousi-foreground">{{ total }}</span> contributions</div>
      </div>
      <div class="flex gap-4">
        <button
          v-for="(_, name) in ranges"
          :key="name"
          type="button"
          class="text-sm transition-colors"
          :class="range === name ? 'font-medium text-ousi-foreground' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="range = name"
        >
          {{ name }}
        </button>
      </div>
    </div>

    <OHeatmap
      :key="range"
      :rows="rows"
      :columns="columns"
      color="violet"
      :levels="4"
      square
      :gap="weeks > 30 ? 4 : 6"
      :cell-radius="weeks > 30 ? 4 : 8"
      :show-row-labels="false"
      column-labels-position="bottom"
      column-label-align="start"
      :cell-label="describe"
      show-legend
      :legend-labels="['Less', 'More']"
    />
  </OCard>
</template>`,
      },
    },
    {
      id: 'hours',
      title: 'Recipe: range dropdown',
      example: {
        component: 'HeatmapHours',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODropdown, ODropdownItem, ODropdownMenu, ODropdownPopover, ODropdownTrigger, OHeatmap } from '@ousi-ui/vue'
import type { HeatmapFocus } from '@ousi-ui/vue'

const rand = (seed: number) => { const x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x) }
const hours = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ranges = [
  { key: 'week', label: 'This week', scale: 1 },
  { key: 'month', label: 'This month', scale: 4 },
  { key: 'quarter', label: 'This quarter', scale: 12 },
]
const range = ref(ranges[0])
const focused = ref<HeatmapFocus | null>(null)

const rows = computed(() =>
  days.map((label, d) => ({
    label,
    values: hours.map((_, h) => {
      const peak = Math.exp(-Math.pow(h - (d < 5 ? 3.5 : 5), 2) / 5)
      return Math.round((20 + rand(d * 10 + h + range.value.scale) * 40) * peak * range.value.scale)
    }),
  })),
)
const total = computed(() => rows.value.reduce((s, r) => s + r.values.reduce((a, b) => a + b, 0), 0))
const active = computed(() => (focused.value ? rows.value[focused.value.row].values[focused.value.col] : null))
</script>
<template>
  <OCard class="w-full max-w-lg gap-4 p-5">
    <div class="flex items-start justify-between">
      <div>
        <div class="text-sm font-medium text-ousi-muted">
          {{ focused ? \`\${days[focused.row]} · \${hours[focused.col]}\` : 'Active users' }}
        </div>
        <OAnimatedNumber :value="active ?? total" animation="count" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
      </div>
      <ODropdown>
        <ODropdownTrigger>
          <button type="button" class="rounded-full bg-ousi-default px-3 py-1 text-xs font-medium text-ousi-foreground">{{ range.label }} ▾</button>
        </ODropdownTrigger>
        <ODropdownPopover placement="bottom-end">
          <ODropdownMenu @action="(k) => (range = ranges.find((r) => r.key === k)!)">
            <ODropdownItem v-for="r in ranges" :id="r.key" :key="r.key">{{ r.label }}</ODropdownItem>
          </ODropdownMenu>
        </ODropdownPopover>
      </ODropdown>
    </div>
    <OHeatmap v-model:focused="focused" :rows="rows" :columns="hours" color="success" :tooltip="false" show-legend />
  </OCard>
</template>`,
      },
    },
    {
      id: 'colors',
      title: 'Colors and max',
      example: {
        component: 'HeatmapColors',
        code: `<script setup lang="ts">
import { OHeatmap } from '@ousi-ui/vue'

const columns = ['Q1', 'Q2', 'Q3', 'Q4']
const rows = [
  { label: 'North', values: [42, 58, 71, 90] },
  { label: 'South', values: [30, 44, 39, 62] },
  { label: 'East', values: [55, 61, 78, 84] },
  { label: 'West', values: [18, 27, 35, 48] },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-3">
    <OHeatmap :rows="rows" :columns="columns" color="success" :cell-height="36" />
    <OHeatmap :rows="rows" :columns="columns" color="#f43f5e" :cell-height="36" />
    <OHeatmap :rows="rows" :columns="columns" color="var(--ousi-violet)" :cell-height="36" :max="120" />
  </div>
</template>`,
      },
    },
    {
      id: 'cell',
      title: 'Cell slot',
      example: {
        component: 'HeatmapCellSlot',
        code: `<script setup lang="ts">
import { OHeatmap } from '@ousi-ui/vue'

const columns = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const rows = [
  { label: 'Search', values: [320, 410, 380, 520, 610, 680] },
  { label: 'Social', values: [180, 220, 260, 240, 310, 290] },
  { label: 'Email', values: [90, 140, 120, 180, 160, 210] },
  { label: 'Direct', values: [250, 230, 270, 300, 280, 340] },
]
</script>
<template>
  <!-- \`cell\` renders anything inside each cell -->
  <OHeatmap :rows="rows" :columns="columns" :cell-height="44" :gap="6" color="orange">
    <template #cell="{ cell }">{{ cell.value }}</template>
  </OHeatmap>
</template>`,
      },
    },
    {
      id: 'hover',
      title: 'Recipe: header reacts to hover',
      example: {
        component: 'HeatmapHover',
        code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OHeatmap } from '@ousi-ui/vue'
import type { HeatmapFocus } from '@ousi-ui/vue'

const columns = ['6a', '9a', '12p', '3p', '6p', '9p']
const rows = [
  { label: 'Mon', values: [12, 48, 62, 55, 38, 14] },
  { label: 'Tue', values: [10, 52, 70, 61, 40, 18] },
  { label: 'Wed', values: [14, 55, 74, 66, 44, 20] },
  { label: 'Thu', values: [11, 50, 68, 72, 46, 22] },
  { label: 'Fri', values: [9, 44, 60, 58, 52, 34] },
]
const focused = ref<HeatmapFocus | null>(null)
const total = rows.reduce((s, r) => s + r.values.reduce((a, b) => a + b, 0), 0)
const active = computed(() => (focused.value ? rows[focused.value.row].values[focused.value.col] : null))
</script>
<template>
  <!-- v-model:focused gives the hovered cell; row and column labels highlight on their own. -->
  <OCard class="w-full max-w-md gap-4 p-5">
    <div>
      <div class="text-sm font-medium text-ousi-muted">
        {{ focused ? \`\${rows[focused.row].label} · \${columns[focused.col]}\` : 'Active users' }}
      </div>
      <div class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground">
        {{ active ?? total.toLocaleString() }}
      </div>
    </div>
    <OHeatmap v-model:focused="focused" :rows="rows" :columns="columns" show-legend />
  </OCard>
</template>`,
      },
    },
    {
      id: 'events',
      title: 'Events',
      example: {
        component: 'HeatmapEvents',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OHeatmap } from '@ousi-ui/vue'
import type { HeatmapCell } from '@ousi-ui/vue'

const columns = ['A', 'B', 'C', 'D', 'E']
const rows = [
  { label: 'One', values: [3, 8, 5, 9, 2] },
  { label: 'Two', values: [7, 2, 9, 4, 6] },
  { label: 'Three', values: [5, 6, 1, 8, 3] },
]
const picked = ref<HeatmapCell[]>([])
function toggle(c: HeatmapCell) {
  const i = picked.value.findIndex((p) => p.row === c.row && p.col === c.col)
  picked.value = i >= 0 ? picked.value.filter((_, k) => k !== i) : [...picked.value, c]
}
</script>
<template>
  <div class="flex flex-col gap-4">
    <OHeatmap :rows="rows" :columns="columns" :cell-height="40" @cell-click="toggle">
      <template #cell="{ cell }">
        <span v-if="picked.some((p) => p.row === cell.row && p.col === cell.col)">✓</span>
      </template>
    </OHeatmap>
    <p class="text-xs text-ousi-muted">
      Click cells to select them ·
      <span class="tabular-nums text-ousi-foreground">{{ picked.length }}</span> selected,
      sum <span class="tabular-nums text-ousi-foreground">{{ picked.reduce((s, c) => s + c.value, 0) }}</span>
    </p>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'rows', type: 'HeatmapRow[]', description: 'Rows: { label, values[] }, one value per column.' },
    { name: 'columns', type: 'string[]', description: 'Column labels.' },
    { name: 'color', type: 'string', default: '\'accent\'', description: 'Token name or any CSS color for the ramp.' },
    { name: 'max', type: 'number', default: 'largest value', description: 'Value rendered at full intensity.' },
    { name: 'min', type: 'number', default: '0', description: 'Value rendered at zero intensity.' },
    { name: 'levels', type: 'number', default: '0', description: 'Number of discrete intensity steps, like a contribution calendar. 0 keeps the ramp continuous.' },
    { name: 'emptyColor', type: 'string', default: "'var(--ousi-default)'", description: 'Color of cells at or below min. Only used with levels.' },
    { name: 'square', type: 'boolean', default: 'false', description: 'Make the cells square; their size follows the available width.' },
    { name: 'columnLabelsPosition', type: "'top' | 'bottom'", default: "'top'", description: 'Where the column labels go.' },
    { name: 'columnLabelAlign', type: "'center' | 'start'", default: "'center'", description: 'Alignment of the column labels. start suits sparse labels such as months (use empty strings for the rest).' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'Show a tooltip over the hovered cell.' },
    { name: 'cellLabel', type: '(cell: HeatmapCell) => string', default: '-', description: 'Text of the tooltip and aria label. Defaults to "row · column: value".' },
    { name: 'gap', type: 'number', default: '4', description: 'Space between cells in px.' },
    { name: 'cellHeight', type: 'number', default: '32', description: 'Cell height in px. Width is fluid.' },
    { name: 'cellRadius', type: 'number', default: '8', description: 'Corner radius of the cells in px.' },
    { name: 'showRowLabels', type: 'boolean', default: 'true', description: 'Show the row labels.' },
    { name: 'showColumnLabels', type: 'boolean', default: 'true', description: 'Show the column labels.' },
    { name: 'showLegend', type: 'boolean', default: 'false', description: 'Show a "less → more" scale.' },
    { name: 'legendLabels', type: '[string, string]', default: '[\'Less\', \'More\']', description: 'Texts of the legend.' },
    { name: 'formatValue', type: '(value: number) => string', description: 'Formats values for slots and aria.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover, focus and click reactions.' },
    { name: 'focused', type: '{ row, col } | null', default: 'null', description: 'Highlighted cell. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount.' },
    { name: 'label', type: 'string', description: 'Accessible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'tooltip', type: '{ cell }', description: 'Replaces the tooltip content.' },
    { name: 'cell', type: '{ cell, focused }', description: 'Content of each cell. cell has row, col, rowLabel, colLabel, value, intensity and formatted.' },
    { name: 'legend', type: '-', description: 'Replaces the legend.' },
  ],

  emits: [
    { name: 'update:focused', type: '(focus: { row, col } | null)', description: 'Highlighted cell changed (v-model:focused).' },
    { name: 'cell-enter', type: '(cell: HeatmapCell, event: Event)', description: 'Pointer or keyboard focus enters a cell.' },
    { name: 'cell-leave', type: '(cell: HeatmapCell, event: Event)', description: 'Pointer or keyboard focus leaves a cell.' },
    { name: 'cell-click', type: '(cell: HeatmapCell, event: Event)', description: 'A cell is clicked or activated with Enter/Space.' },
  ],

  keyboard: [
    { key: 'Tab', description: 'Moves focus into the chart and out of it. The chart is a single tab stop, however many items it has.' },
    { key: 'Arrow keys', description: 'Left and Right move between cells; Up and Down jump a whole row.' },
    { key: 'Home / End', description: 'Jumps to the first or the last item.' },
    { key: 'Enter / Space', description: 'Emits the click event of the focused item.' },
  ],
}
