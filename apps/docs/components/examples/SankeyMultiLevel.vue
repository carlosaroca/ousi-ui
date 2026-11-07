<script setup lang="ts">
import { OSankey } from '@ousi-ui/vue'

const nodes = [
  { name: 'Revenue', color: 'accent' },
  { name: 'Subscriptions', color: 'violet' }, { name: 'Services', color: 'orange' },
  { name: 'Payroll' }, { name: 'Cloud' }, { name: 'Marketing' }, { name: 'Profit', color: 'success' },
]
const links = [
  { source: 'Revenue', target: 'Subscriptions', value: 640 },
  { source: 'Revenue', target: 'Services', value: 260 },
  { source: 'Subscriptions', target: 'Payroll', value: 300 },
  { source: 'Subscriptions', target: 'Cloud', value: 110 },
  { source: 'Subscriptions', target: 'Profit', value: 230 },
  { source: 'Services', target: 'Payroll', value: 120 },
  { source: 'Services', target: 'Marketing', value: 60 },
  { source: 'Services', target: 'Profit', value: 80 },
]
</script>
<template>
  <OSankey :nodes="nodes" :links="links" :height="340" :format-value="(v) => `$${v}k`" />
</template>
