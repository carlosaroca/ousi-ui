<script setup lang="ts">
import { OWaterfallChart } from '@ousi-ui/vue'

const data = [
  { label: 'Q1', value: 40 },
  { label: 'Q2', value: 25 },
  { label: 'Q3', value: -18 },
  { label: 'Q4', value: 31 },
  { label: 'Year', total: true },
]
</script>
<template>
  <div class="grid w-full min-w-0 gap-8 md:grid-cols-2">
    <div class="min-w-0">
      <p class="mb-2 text-xs text-ousi-muted">no connectors, no values</p>
      <OWaterfallChart :data="data" :height="200" :connectors="false" :show-values="false" />
    </div>
    <div class="min-w-0">
      <p class="mb-2 text-xs text-ousi-muted">pills, own colours</p>
      <OWaterfallChart :data="data" :height="200" :bar-radius="40" :bar-gap="0.55" increase-color="accent" decrease-color="orange" total-color="violet" :grid="false" :show-y-axis="false" />
    </div>
  </div>
</template>
