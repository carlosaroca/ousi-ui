<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

const data = [
  { d: 'Mon', v: 62 }, { d: 'Tue', v: 68 }, { d: 'Wed', v: 64 }, { d: 'Thu', v: 75 },
  { d: 'Fri', v: 81 }, { d: 'Sat', v: 77 }, { d: 'Sun', v: 84 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">baseline="auto" (fits the data)</p>
      <OAreaChart :data="data" category-key="d" baseline="auto" :height="170" :series="[{ key: 'v', label: 'Score', color: 'violet' }]" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Linear, with points</p>
      <OAreaChart :data="data" category-key="d" curve="linear" show-points :height="170" :series="[{ key: 'v', label: 'Score', color: 'orange' }]" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">No axes, no grid</p>
      <OAreaChart :data="data" category-key="d" :show-x-axis="false" :show-y-axis="false" :grid="false" :height="120" :series="[{ key: 'v', label: 'Score', color: 'success' }]" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Static, stronger fill</p>
      <OAreaChart :data="data" category-key="d" :interactive="false" :fill-opacity="0.5" :height="170" :series="[{ key: 'v', label: 'Score', color: '#f43f5e' }]" />
    </div>
  </div>
</template>
