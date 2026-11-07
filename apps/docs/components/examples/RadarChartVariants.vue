<script setup lang="ts">
import { ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', a: 82, b: 60 }, { label: 'Power', a: 64, b: 78 }, { label: 'Range', a: 91, b: 55 },
  { label: 'Agility', a: 58, b: 84 }, { label: 'Defense', a: 73, b: 66 }, { label: 'Stamina', a: 86, b: 70 },
]
const series = [{ key: 'a', label: 'Player A', color: 'accent' }, { key: 'b', label: 'Player B', color: 'orange' }]
</script>
<template>
  <div class="flex flex-wrap items-start gap-6">
    <div class="flex flex-col items-center gap-1"><ORadarChart :data="data" :series="[series[0]]" :max="100" :size="170" /><span class="text-xs text-ousi-muted">filled</span></div>
    <div class="flex flex-col items-center gap-1"><ORadarChart :data="data" :series="[series[0]]" :max="100" :size="170" variant="dots" /><span class="text-xs text-ousi-muted">dots</span></div>
    <div class="flex flex-col items-center gap-1"><ORadarChart :data="data" :series="series" :max="100" :size="170" variant="lines" /><span class="text-xs text-ousi-muted">lines (compare)</span></div>
  </div>
</template>
