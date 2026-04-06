<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OChart } from '@ousi-ui/vue'
import type { CandlePoint } from '@ousi-ui/vue'

const candles = ref<CandlePoint[]>([])
const liveCandle = ref<CandlePoint | undefined>()
let interval: ReturnType<typeof setInterval>

// Seed data immediately (not in onMounted) so it's available for first render
const now = Date.now() / 1000
const width = 10
let price = 100
const initialCandles: CandlePoint[] = []
for (let i = 30; i >= 1; i--) {
  const time = now - i * width
  const open = price
  const delta = (Math.random() - 0.48) * 1.5
  const close = open + delta
  const high = Math.max(open, close) + Math.random() * 0.5
  const low = Math.min(open, close) - Math.random() * 0.5
  initialCandles.push({ time, open, high, low, close })
  price = close
}
candles.value = initialCandles
const liveTime = now - (now % width)
liveCandle.value = { time: liveTime, open: price, high: price + 0.2, low: price - 0.2, close: price }

onMounted(() => {
  interval = setInterval(() => {
    if (!liveCandle.value) return
    const tick = (Math.random() - 0.48) * 0.4
    const lc = { ...liveCandle.value }
    lc.close += tick
    if (lc.close > lc.high) lc.high = lc.close
    if (lc.close < lc.low) lc.low = lc.close
    liveCandle.value = lc
  }, 300)
})
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="h-64 w-full">
    <OChart
      :data="[]"
      :value="0"
      mode="candle"
      :candles="candles"
      :candle-width="10"
      :live-candle="liveCandle"
      color="#f59e0b"
      theme="light"
      :badge="false"
      :momentum="false"
      :fill="false"
      :window="300"
    />
  </div>
</template>
