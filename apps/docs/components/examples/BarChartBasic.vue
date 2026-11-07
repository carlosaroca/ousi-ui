<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

// A full-length track behind each bar, a ring around the hovered one and custom value ticks.
const data = [
  { m: 'Jan', v: 3100 }, { m: 'Feb', v: 6900 }, { m: 'Mar', v: 9650 }, { m: 'Apr', v: 6400 },
  { m: 'May', v: 3600 }, { m: 'Jun', v: 2400 }, { m: 'Jul', v: 3800 }, { m: 'Aug', v: 5100 },
  { m: 'Sep', v: 6600 }, { m: 'Oct', v: 4700 }, { m: 'Nov', v: 11400 }, { m: 'Dec', v: 7900 },
]
const short = (v: number) => (v >= 1000 ? `$${v / 1000}K` : `$${v}`)
</script>
<template>
  <OBarChart
    :data="data"
    category-key="m"
    :series="[{ key: 'v', label: 'Earned', color: '#aee637' }]"
    track
    :ticks="[0, 3000, 5000, 10000]"
    :max="12000"
    :height="300"
    :format-value="short"
  />
</template>
