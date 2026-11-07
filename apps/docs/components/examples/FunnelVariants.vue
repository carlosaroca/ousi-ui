<script setup lang="ts">
import { OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Impressions', value: 120000, color: '#aee637' },
  { label: 'Clicks', value: 21000, color: '#4f8ff7' },
  { label: 'Add to cart', value: 6400, color: '#b57bff' },
  { label: 'Purchase', value: 1800, color: '#ec6fb5' },
]
</script>
<template>
  <div class="grid gap-10 md:grid-cols-2">
    <div>
      <p class="mb-3 text-xs text-ousi-muted">shape="sharp"</p>
      <OFunnel :stages="stages" shape="sharp" :height="150" :show-legend="false" />
    </div>
    <div>
      <p class="mb-3 text-xs text-ousi-muted">mono</p>
      <OFunnel :stages="stages" mono :height="150" :show-legend="false" />
    </div>
    <div>
      <p class="mb-3 text-xs text-ousi-muted">no halo</p>
      <OFunnel :stages="stages" :halo="false" :height="150" :show-legend="false" />
    </div>
    <div>
      <p class="mb-3 text-xs text-ousi-muted">bars + mono, no percentages</p>
      <OFunnel :stages="stages" variant="bars" mono :show-percent="false" />
    </div>
  </div>
</template>
