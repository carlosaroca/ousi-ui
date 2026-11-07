<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { c: 'Spain', v: 8420 }, { c: 'Mexico', v: 7310 }, { c: 'Colombia', v: 6150 },
  { c: 'Chile', v: 4280 }, { c: 'Peru', v: 3190 }, { c: 'Uruguay', v: 1640 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Ranking with track</p>
      <OBarChart :data="data" category-key="c" orientation="horizontal" track :bar-radius="10" :bar-gap="0.4" :height="260" :series="[{ key: 'v', label: 'Users', color: '#4f8ff7' }]" :ticks="[0, 4000, 8000]" :max="9000" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Horizontal stacked</p>
      <OBarChart
        :data="[{ c: 'Free', a: 40, b: 25 }, { c: 'Pro', a: 28, b: 35 }, { c: 'Team', a: 18, b: 22 }, { c: 'Enterprise', a: 9, b: 14 }]"
        category-key="c" orientation="horizontal" stacked :bar-radius="8" :height="260" grid
        :series="[{ key: 'a', label: 'Active', color: 'success' }, { key: 'b', label: 'Dormant', color: '#9ca3af' }]"
      />
    </div>
  </div>
</template>
