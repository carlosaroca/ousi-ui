<script setup lang="ts">
import { ODonutChart } from '@ousi-ui/vue'

const data = [
  { label: 'A', value: 45, color: 'accent' },
  { label: 'B', value: 30, color: 'violet' },
  { label: 'C', value: 15, color: 'orange' },
  { label: 'D', value: 10, color: 'success' },
]
</script>
<template>
  <div class="flex flex-wrap items-center gap-10">
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" /><span class="text-xs text-ousi-muted">donut</span></div>
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" :thickness="8" :gap="3" rounded /><span class="text-xs text-ousi-muted">thin, rounded</span></div>
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" :thickness="30" :gap="1" /><span class="text-xs text-ousi-muted">thick</span></div>
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" variant="pie" :gap="1" /><span class="text-xs text-ousi-muted">pie</span></div>
    <div class="flex flex-col items-center gap-2"><ODonutChart :data="data" :size="150" :explode="0" :interactive="false" /><span class="text-xs text-ousi-muted">static</span></div>
  </div>
</template>
