<script setup lang="ts">
import { OComboChart } from '@ousi-ui/vue'

const data = [
  { month: 'Jan', sessions: 8200, conversion: 2.9 },
  { month: 'Feb', sessions: 9100, conversion: 3.1 },
  { month: 'Mar', sessions: 8700, conversion: 3.0 },
  { month: 'Apr', sessions: 10400, conversion: 3.6 },
  { month: 'May', sessions: 11800, conversion: 3.9 },
  { month: 'Jun', sessions: 12600, conversion: 4.2 },
]
</script>
<template>
  <OComboChart
    :data="data"
    category-key="month"
    :bar="{ key: 'sessions', label: 'Sessions' }"
    :line="{ key: 'conversion', label: 'Conversion', format: (v) => `${v}%` }"
  />
</template>
