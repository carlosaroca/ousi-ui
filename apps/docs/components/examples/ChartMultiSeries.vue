<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OChart } from '@ousi-ui/vue'
import type { ChartPoint, ChartSeries } from '@ousi-ui/vue'

const series = ref<ChartSeries[]>([])
let interval: ReturnType<typeof setInterval>

// Seed data immediately so it's available for first render
const now = Date.now() / 1000
let vA = 100, vB = 98, vC = 102
const dataA: ChartPoint[] = []
const dataB: ChartPoint[] = []
const dataC: ChartPoint[] = []
for (let i = 60; i >= 0; i--) {
  const t = now - i
  vA += (Math.random() - 0.5) * 0.3
  vB += (Math.random() - 0.48) * 0.35
  vC += (Math.random() - 0.52) * 0.25
  dataA.push({ time: t, value: vA })
  dataB.push({ time: t, value: vB })
  dataC.push({ time: t, value: vC })
}
series.value = [
  { id: 'btc', data: dataA, value: vA, color: '#f59e0b', label: 'BTC' },
  { id: 'eth', data: dataB, value: vB, color: '#3b82f6', label: 'ETH' },
  { id: 'sol', data: dataC, value: vC, color: '#8b5cf6', label: 'SOL' },
]

onMounted(() => {
  interval = setInterval(() => {
    const t = Date.now() / 1000
    series.value = series.value.map(s => {
      const newValue = s.value + (Math.random() - 0.5) * 0.25
      return {
        ...s,
        value: newValue,
        data: [...s.data.slice(-120), { time: t, value: newValue }],
      }
    })
  }, 500)
})
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="h-64 w-full">
    <OChart
      :data="[]"
      :value="0"
      :series="series"
      theme="light"
      :badge="false"
      :fill="false"
      :momentum="false"
    />
  </div>
</template>
