<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OChart } from '@ousi-ui/vue'
import type { ChartPoint } from '@ousi-ui/vue'

const data = ref<ChartPoint[]>([])
const value = ref(100)
let interval: ReturnType<typeof setInterval>

function seed() {
  const now = Date.now() / 1000
  const pts: ChartPoint[] = []
  let v = 100
  for (let i = 60; i >= 0; i--) {
    v += (Math.random() - 0.5) * 0.4
    pts.push({ time: now - i, value: v })
  }
  data.value = pts
  value.value = v
}

onMounted(() => {
  seed()
  interval = setInterval(() => {
    const now = Date.now() / 1000
    value.value += (Math.random() - 0.5) * 0.3
    data.value = [...data.value.slice(-120), { time: now, value: value.value }]
  }, 500)
})
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="h-64 w-full">
    <OChart :data="data" :value="value" color="#3b82f6" theme="light" />
  </div>
</template>
