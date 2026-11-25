<script setup lang="ts">
import { OWaterfallChart } from '@ousi-ui/vue'

const money = (v: number) => `${v < 0 ? '−' : ''}$${Math.abs(v)}k`

// How revenue becomes profit. A total with a value opens the account; without one, it adds up.
const data = [
  { label: 'Revenue', value: 420, total: true },
  { label: 'Cost of goods', value: -150 },
  { label: 'Gross', total: true },
  { label: 'Salaries', value: -110 },
  { label: 'Marketing', value: -45 },
  { label: 'Services', value: 38 },
  { label: 'Net', total: true },
]
</script>
<template>
  <OWaterfallChart :data="data" :height="300" :format-value="money" />
</template>
