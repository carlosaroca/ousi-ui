<script setup lang="ts">
import { OTreemap } from '@ousi-ui/vue'

// Nodes with children become frames; their sum is the size.
const data = [
  { name: 'Engineering', color: '#4f8ff7', children: [
    { name: 'Platform', value: 1800 }, { name: 'Mobile', value: 1300 }, { name: 'Data', value: 900 }, { name: 'QA', value: 500 },
  ] },
  { name: 'Go to market', color: '#ec6fb5', children: [
    { name: 'Ads', value: 1500 }, { name: 'Events', value: 700 }, { name: 'Content', value: 600 },
  ] },
  { name: 'Operations', color: '#f2b93b', children: [
    { name: 'Support', value: 900 }, { name: 'Finance', value: 500 }, { name: 'People', value: 450 },
  ] },
  { name: 'Legal', value: 700, color: '#aee637' },
]
</script>
<template>
  <OTreemap :data="data" :height="360" :format-value="(v) => `$${(v / 1000).toFixed(1)}k`" />
</template>
