<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OChart, OButton } from '@ousi-ui/vue'
import type { ChartPoint } from '@ousi-ui/vue'

const data = ref<ChartPoint[]>([])
const value = ref(100)
const isLive = ref(false)
let interval: ReturnType<typeof setInterval>

function start() {
  if (isLive.value) return
  isLive.value = true
  const now = Date.now() / 1000
  let v = 100
  const pts: ChartPoint[] = []
  for (let i = 30; i >= 0; i--) {
    v += (Math.random() - 0.5) * 0.4
    pts.push({ time: now - i, value: v })
  }
  data.value = pts
  value.value = v

  interval = setInterval(() => {
    value.value += (Math.random() - 0.5) * 0.3
    data.value = [...data.value.slice(-120), { time: Date.now() / 1000, value: value.value }]
  }, 500)
}

function stop() {
  isLive.value = false
  clearInterval(interval)
  data.value = []
  value.value = 100
}

onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <OButton size="sm" variant="soft" @click="start">Load data</OButton>
      <OButton size="sm" variant="ghost" @click="stop">Clear</OButton>
      <span class="text-xs text-ousi-muted">{{ isLive ? 'Streaming...' : 'Empty — shows loading squiggly' }}</span>
    </div>
    <div class="h-56 w-full">
      <OChart :data="data" :value="value" color="#3b82f6" theme="light" />
    </div>
  </div>
</template>
