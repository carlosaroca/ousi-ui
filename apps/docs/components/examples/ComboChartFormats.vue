<script setup lang="ts">
import { OComboChart } from '@ousi-ui/vue'

// Each series has its own axis and formatter, so a currency and a ratio can share one chart.
const data = [
  { q: 'Q1 24', revenue: 182000, margin: 21.4 },
  { q: 'Q2 24', revenue: 214000, margin: 23.1 },
  { q: 'Q3 24', revenue: 196000, margin: 19.8 },
  { q: 'Q4 24', revenue: 268000, margin: 26.5 },
  { q: 'Q1 25', revenue: 241000, margin: 24.2 },
  { q: 'Q2 25', revenue: 305000, margin: 28.7 },
]
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 0 })
</script>
<template>
  <OComboChart
    :data="data"
    category-key="q"
    :bar="{ key: 'revenue', label: 'Revenue', color: 'var(--ousi-violet)', format: (v) => usd.format(v) }"
    :line="{ key: 'margin', label: 'Margin', color: 'var(--ousi-success)', format: (v) => `${v.toFixed(1)}%` }"
  />
</template>
