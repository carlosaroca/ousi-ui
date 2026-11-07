<script setup lang="ts">
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
</template>
