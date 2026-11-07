<script setup lang="ts">
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
  <!-- `cell` renders anything inside each cell -->
  <OHeatmap :rows="rows" :columns="columns" :cell-height="44" :gap="6" color="orange">
    <template #cell="{ cell }">{{ cell.value }}</template>
  </OHeatmap>
</template>
