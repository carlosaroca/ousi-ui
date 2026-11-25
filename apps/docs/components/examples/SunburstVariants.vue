<script setup lang="ts">
import { OSunburst } from '@ousi-ui/vue'

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
  <div class="flex w-full flex-wrap items-start justify-center gap-8">
    <div class="flex flex-col items-center gap-2">
      <OSunburst :data="data" :size="220" :levels="1" :inner-radius="0.62" :corner-radius="4" :gap="1.2" />
      <span class="text-xs text-ousi-muted">one ring, rounder</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <OSunburst :data="data" :size="220" :corner-radius="0" :gap="0.4" :show-labels="false" />
      <span class="text-xs text-ousi-muted">sharp, no names</span>
    </div>
  </div>
</template>
