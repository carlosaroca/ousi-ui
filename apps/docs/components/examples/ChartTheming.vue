<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { OChart, OButton } from '@ousi-ui/vue'
import type { ChartPoint } from '@ousi-ui/vue'

const data = ref<ChartPoint[]>([])
const value = ref(100)
const theme = ref<'dark' | 'light'>('dark')
const color = ref('#3b82f6')
let interval: ReturnType<typeof setInterval>

const colors = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899']

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

  interval = setInterval(() => {
    value.value += (Math.random() - 0.5) * 0.3
    data.value = [...data.value.slice(-120), { time: Date.now() / 1000, value: value.value }]
  }, 500)
})
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2 flex-wrap">
      <OButton
        size="sm"
        :variant="theme === 'dark' ? 'soft' : 'ghost'"
        @click="theme = 'dark'"
      >Dark</OButton>
      <OButton
        size="sm"
        :variant="theme === 'light' ? 'soft' : 'ghost'"
        @click="theme = 'light'"
      >Light</OButton>
      <span class="w-px h-4 bg-ousi-border mx-1" />
      <button
        v-for="c in colors"
        :key="c"
        class="w-5 h-5 rounded-full border-2 transition-transform"
        :class="color === c ? 'border-ousi-foreground scale-110' : 'border-transparent'"
        :style="{ backgroundColor: c }"
        @click="color = c"
      />
    </div>
    <div
      class="h-56 w-full rounded-ousi-xl overflow-hidden transition-colors duration-300"
      :style="{ backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff' }"
    >
      <OChart :data="data" :value="value" :color="color" :theme="theme" badge />
    </div>
  </div>
</template>
