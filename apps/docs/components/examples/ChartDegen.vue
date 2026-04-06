<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OChart } from '@ousi-ui/vue'
import type { ChartPoint } from '@ousi-ui/vue'

const data = ref<ChartPoint[]>([])
const value = ref(100)
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  const now = Date.now() / 1000
  let v = 100
  const pts: ChartPoint[] = []
  for (let i = 60; i >= 0; i--) {
    v += (Math.random() - 0.5) * 0.5
    pts.push({ time: now - i, value: v })
  }
  data.value = pts
  value.value = v

  interval = setInterval(() => {
    // Occasional large swings to trigger particles
    const swing = Math.random() < 0.1 ? (Math.random() - 0.3) * 3 : (Math.random() - 0.5) * 0.3
    value.value += swing
    data.value = [...data.value.slice(-120), { time: Date.now() / 1000, value: value.value }]
  }, 200)
})
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="h-64 w-full">
    <OChart :data="data" :value="value" color="#ef4444" theme="light" :degen="true" exaggerate />
  </div>
</template>
