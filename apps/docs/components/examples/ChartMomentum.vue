<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OChart } from '@ousi-ui/vue'
import type { ChartPoint } from '@ousi-ui/vue'

const data = ref<ChartPoint[]>([])
const value = ref(50)
let interval: ReturnType<typeof setInterval>
let trend = 1

onMounted(() => {
  const now = Date.now() / 1000
  let v = 50
  const pts: ChartPoint[] = []
  for (let i = 60; i >= 0; i--) {
    v += (Math.random() - 0.5) * 0.3
    pts.push({ time: now - i, value: v })
  }
  data.value = pts
  value.value = v

  interval = setInterval(() => {
    if (Math.random() < 0.05) trend *= -1
    value.value += trend * Math.random() * 0.4 + (Math.random() - 0.5) * 0.1
    data.value = [...data.value.slice(-120), { time: Date.now() / 1000, value: value.value }]
  }, 300)
})
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="h-64 w-full">
    <OChart :data="data" :value="value" color="#3b82f6" theme="light" :momentum="true" badge />
  </div>
</template>
