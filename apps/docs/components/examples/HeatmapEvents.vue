<script setup lang="ts">
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
</template>
