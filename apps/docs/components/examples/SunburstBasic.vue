<script setup lang="ts">
import { OSunburst } from '@ousi-ui/vue'

// The same shape as a treemap's data. Click a sector with parts to bring it to the middle.
const data = [
  {
    name: 'Product',
    children: [
      { name: 'Design', value: 42 },
      { name: 'Web', children: [{ name: 'App', value: 60 }, { name: 'Docs', value: 18 }] },
      { name: 'Mobile', children: [{ name: 'iOS', value: 34 }, { name: 'Android', value: 30 }] },
    ],
  },
  { name: 'Sales', children: [{ name: 'Direct', value: 70 }, { name: 'Partners', value: 28 }] },
  { name: 'Support', children: [{ name: 'Tickets', value: 44 }, { name: 'Training', value: 16 }] },
  { name: 'Legal', value: 22 },
]
</script>
<template>
  <OSunburst :data="data" :size="380" root-label="Budget" :format-value="(v) => `$${v}k`" />
</template>
