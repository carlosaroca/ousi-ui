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

const few = prices(8, 64, 4)
const many = prices(90, 320, 11)
</script>
<template>
  <div class="grid w-full min-w-0 gap-8 md:grid-cols-2">
    <div class="min-w-0">
      <p class="mb-2 text-xs text-ousi-muted">few periods, rounder, own colours</p>
      <OCandlestickChart :data="few" :height="200" :bar-radius="12" :max-bar-width="18" up-color="accent" down-color="orange" />
    </div>
    <div class="min-w-0">
      <p class="mb-2 text-xs text-ousi-muted">90 periods, no grid, no axes</p>
      <OCandlestickChart :data="many" :height="200" :grid="false" :show-x-axis="false" :show-y-axis="false" />
    </div>
  </div>
</template>
