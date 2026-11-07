<script setup lang="ts">
import { OSankey } from '@ousi-ui/vue'

const nodes = [{ name: 'A', color: 'accent' }, { name: 'B', color: 'orange' }, { name: 'X' }, { name: 'Y' }, { name: 'Z' }]
const links = [
  { source: 'A', target: 'X', value: 40 }, { source: 'A', target: 'Y', value: 25 },
  { source: 'B', target: 'Y', value: 30 }, { source: 'B', target: 'Z', value: 20 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">No labels, thin nodes</p>
      <OSankey :nodes="nodes" :links="links" :height="180" :show-labels="false" :node-width="6" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Wide nodes, large padding</p>
      <OSankey :nodes="nodes" :links="links" :height="180" :node-width="22" :node-padding="28" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Static, custom format</p>
      <OSankey :nodes="nodes" :links="links" :height="180" :interactive="false" :format-value="(v) => `${v} GB`" />
    </div>
  </div>
</template>
