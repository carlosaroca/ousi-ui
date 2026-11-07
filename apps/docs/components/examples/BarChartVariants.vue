<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { d: 'M', v: 62 }, { d: 'T', v: 88 }, { d: 'W', v: 45 }, { d: 'T', v: 95 }, { d: 'F', v: 71 }, { d: 'S', v: 30 }, { d: 'S', v: 18 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-3">
    <div><p class="mb-2 text-xs text-ousi-muted">dim others on hover, no ring (:outline="false")</p><OBarChart :data="data" category-key="d" :height="170" dim :outline="false" :show-y-axis="false" :series="[{ key: 'v', color: 'violet' }]" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">pills (large radius, tall gap)</p><OBarChart :data="data" category-key="d" :height="170" track :bar-radius="20" :bar-gap="0.55" :show-y-axis="false" :series="[{ key: 'v', color: 'orange' }]" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">square, no axes</p><OBarChart :data="data" category-key="d" :height="170" :bar-radius="0" :show-x-axis="false" :show-y-axis="false" :series="[{ key: 'v', color: '#f43f5e' }]" /></div>
  </div>
</template>
