<script setup lang="ts">
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
</template>
