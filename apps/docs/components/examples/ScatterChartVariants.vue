<script setup lang="ts">
import { OScatterChart } from '@ousi-ui/vue'

const series = [
  { label: 'Sample', color: 'accent', points: Array.from({ length: 24 }, (_, i) => ({ x: i + 1, y: 20 + i * 2.1 + ((i * 37) % 17) })) },
]
const bubbles = [
  { label: 'Sample', color: 'orange', points: Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: 20 + i * 3 + ((i * 29) % 13), z: 5 + ((i * 7) % 20) })) },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">No grid, no axes</p>
      <OScatterChart :series="series" :height="190" :grid="false" :show-x-axis="false" :show-y-axis="false" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Bubble forced off (:bubble="false")</p>
      <OScatterChart :series="bubbles" :height="190" :bubble="false" />
    </div>
  </div>
</template>
