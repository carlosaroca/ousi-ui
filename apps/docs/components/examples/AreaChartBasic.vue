<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

const data = [
  { m: 'Jan', v: 12400 }, { m: 'Feb', v: 13800 }, { m: 'Mar', v: 13100 }, { m: 'Apr', v: 15600 },
  { m: 'May', v: 17200 }, { m: 'Jun', v: 16800 }, { m: 'Jul', v: 19400 }, { m: 'Aug', v: 21000 },
]
</script>
<template>
  <OAreaChart
    :data="data"
    category-key="m"
    :series="[{ key: 'v', label: 'Revenue' }]"
    :format-value="(v) => `$${(v / 1000).toFixed(0)}k`"
  />
</template>
