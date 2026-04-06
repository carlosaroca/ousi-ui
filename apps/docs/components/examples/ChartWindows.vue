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
  for (let i = 300; i >= 0; i--) {
    v += (Math.random() - 0.5) * 0.5
    pts.push({ time: now - i, value: v })
  }
  data.value = pts
  value.value = v

  interval = setInterval(() => {
    value.value += (Math.random() - 0.5) * 0.3
    data.value = [...data.value.slice(-600), { time: Date.now() / 1000, value: value.value }]
  }, 500)
})
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="h-64 w-full">
    <OChart
      :data="data"
      :value="value"
      color="#8b5cf6"
      theme="light"
      :windows="[
        { label: '30s', secs: 30 },
        { label: '1m', secs: 60 },
        { label: '5m', secs: 300 },
      ]"
      window-style="rounded"
    />
  </div>
</template>
