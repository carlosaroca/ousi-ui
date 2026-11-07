<script setup lang="ts">
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
  const day = `${MONTHS[d.getMonth()]} ${d.getDate()}`
  return cell.value === 0 ? `No contributions on ${day}` : `${cell.value} contribution${cell.value > 1 ? 's' : ''} on ${day}`
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
</template>
