<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OChart } from '@ousi-ui/vue'
import type { ChartPoint, ChartOrderbookData } from '@ousi-ui/vue'

const data = ref<ChartPoint[]>([])
const value = ref(100)
const orderbook = ref<ChartOrderbookData>({ bids: [], asks: [] })
let interval: ReturnType<typeof setInterval>

function randomBook(): ChartOrderbookData {
  const bids: [number, number][] = []
  const asks: [number, number][] = []
  for (let i = 0; i < 8; i++) {
    bids.push([value.value - (i + 1) * 0.1, Math.random() * 50 + 5])
    asks.push([value.value + (i + 1) * 0.1, Math.random() * 50 + 5])
  }
  return { bids, asks }
}

onMounted(() => {
  const now = Date.now() / 1000
  let v = 100
  const pts: ChartPoint[] = []
  for (let i = 60; i >= 0; i--) {
    v += (Math.random() - 0.5) * 0.4
    pts.push({ time: now - i, value: v })
  }
  data.value = pts
  value.value = v
  orderbook.value = randomBook()

  interval = setInterval(() => {
    value.value += (Math.random() - 0.5) * 0.3
    data.value = [...data.value.slice(-120), { time: Date.now() / 1000, value: value.value }]
    if (Math.random() < 0.3) orderbook.value = randomBook()
  }, 400)
})
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="h-64 w-full">
    <OChart
      :data="data"
      :value="value"
      color="#3b82f6"
      theme="light"
      :orderbook="orderbook"
      :padding="{ top: 12, right: 80, bottom: 28, left: 120 }"
    />
  </div>
</template>
