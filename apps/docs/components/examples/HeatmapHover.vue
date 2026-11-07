<script setup lang="ts">
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
        {{ focused ? `${rows[focused.row].label} · ${columns[focused.col]}` : 'Active users' }}
      </div>
      <div class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground">
        {{ active ?? total.toLocaleString() }}
      </div>
    </div>
    <OHeatmap v-model:focused="focused" :rows="rows" :columns="columns" show-legend />
  </OCard>
</template>
