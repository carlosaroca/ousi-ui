<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { d: 'Mon', paid: 120, organic: 210, referral: 60 }, { d: 'Tue', paid: 150, organic: 240, referral: 75 },
  { d: 'Wed', paid: 90, organic: 260, referral: 82 }, { d: 'Thu', paid: 170, organic: 300, referral: 95 },
  { d: 'Fri', paid: 210, organic: 280, referral: 110 }, { d: 'Sat', paid: 80, organic: 180, referral: 40 },
  { d: 'Sun', paid: 60, organic: 150, referral: 35 },
]
</script>
<template>
  <!-- Stacked bars are rounded as a whole; the tooltip adds the total -->
  <OBarChart
    :data="data"
    category-key="d"
    stacked
    :bar-radius="10"
    :series="[
      { key: 'organic', label: 'Organic', color: '#4f8ff7' },
      { key: 'paid', label: 'Paid', color: '#b57bff' },
      { key: 'referral', label: 'Referral', color: '#aee637' },
    ]"
  />
</template>
