<script setup lang="ts">
import { ODonutChart } from '@ousi-ui/vue'

const data = [
  { label: 'Housing', value: 1400, color: '#4f8ff7' },
  { label: 'Food', value: 620, color: '#aee637' },
  { label: 'Transport', value: 280, color: '#b57bff' },
  { label: 'Leisure', value: 340, color: '#ec6fb5' },
  { label: 'Savings', value: 1360, color: '#f2b93b' },
]
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
</script>
<template>
  <!-- Hover a segment or a legend row: both highlight each other without any v-model -->
  <ODonutChart :data="data" :size="200" :thickness="11" :gap="4" rounded show-legend :format-value="(v) => usd.format(v)" class="w-72" />
</template>
