<script setup lang="ts">
import { OTreemap } from '@ousi-ui/vue'

const data = [
  { name: 'Cloud', value: 4200, color: '#4f8ff7' },
  { name: 'Payroll', value: 3600, color: '#b57bff' },
  { name: 'Marketing', value: 2400, color: '#ec6fb5' },
  { name: 'Tools', value: 1500, color: '#f2b93b' },
  { name: 'Travel', value: 1100, color: '#aee637' },
  { name: 'Legal', value: 700, color: '#38b2d8' },
  { name: 'Misc', value: 420, color: '#9ca3af' },
]
</script>
<template>
  <OTreemap :data="data" :height="300" :format-value="(v) => `$${(v / 1000).toFixed(1)}k`" />
</template>
