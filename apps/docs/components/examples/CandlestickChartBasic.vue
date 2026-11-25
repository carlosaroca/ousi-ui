<script setup lang="ts">
import { OCandlestickChart } from '@ousi-ui/vue'

function prices(count: number, start: number, seed: number) {
  let last = start
  let state = seed
  const random = () => ((state = (state * 48271) % 2147483647) / 2147483647)
  return Array.from({ length: count }, (_, i) => {
    const open = last
    const close = Math.round((open + (random() - 0.46) * 9) * 100) / 100
    last = close
    return {
      label: `${i + 1} Jun`,
      open,
      high: Math.round((Math.max(open, close) + random() * 4) * 100) / 100,
      low: Math.round((Math.min(open, close) - random() * 4) * 100) / 100,
      close,
      volume: Math.round(40000 + random() * 160000),
    }
  })
}

const data = prices(24, 142, 7)
</script>
<template>
  <OCandlestickChart :data="data" :height="300" :format-value="(v) => `$${v.toFixed(2)}`" />
</template>
