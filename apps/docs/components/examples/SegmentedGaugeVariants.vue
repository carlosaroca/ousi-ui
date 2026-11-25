<script setup lang="ts">
import { OSegmentedGauge } from '@ousi-ui/vue'

const segments = [
  { label: 'A', value: 38, max: 50, color: 'accent' },
  { label: 'B', value: 12, max: 30, color: 'orange' },
  { label: 'C', value: 20, max: 20, color: 'success' },
]
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" /><span class="text-xs text-ousi-muted">sweep 270 (default)</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" joined /><span class="text-xs text-ousi-muted">joined</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" :sweep="360" /><span class="text-xs text-ousi-muted">full ring</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" :sweep="220" :stroke-width="14" /><span class="text-xs text-ousi-muted">sweep 220, thicker</span></div>
    <div class="flex flex-col items-center gap-2"><OSegmentedGauge :segments="segments" :size="130" :stroke-width="5" :gap="7" /><span class="text-xs text-ousi-muted">thin, wider gaps</span></div>
  </div>
</template>
