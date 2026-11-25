<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OWaterfallChart } from '@ousi-ui/vue'

const data = [
  { label: 'Open', value: 18, total: true },
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: -22 },
  { label: 'Mar', value: -17 },
  { label: 'Apr', value: 9 },
  { label: 'May', value: 26 },
  { label: 'Jun', value: 14 },
  { label: 'Close', total: true },
]
const money = (v: number) => `${v < 0 ? '−' : ''}$${Math.abs(v)}k`

// The header follows the hovered bar.
const focused = ref<number | null>(null)
const close = 18 + data.slice(1, -1).reduce((total, d) => total + (d.value ?? 0), 0)
const shown = computed(() => {
  if (focused.value == null) return { title: 'Cash at the end of June', value: close }
  const running = data.slice(0, focused.value + 1).reduce((total, d) => total + (d.value ?? 0), 0)
  return { title: `Cash after ${data[focused.value].label}`, value: running }
})
</script>
<template>
  <OCard class="w-full min-w-0 max-w-xl gap-3 p-5">
    <div>
      <div class="text-xs font-medium text-ousi-muted">{{ shown.title }}</div>
      <div class="text-2xl font-semibold tabular-nums text-ousi-foreground">{{ money(shown.value) }}</div>
    </div>
    <!-- It goes below zero: the line at zero is drawn then. -->
    <OWaterfallChart v-model:focused="focused" :data="data" :height="240" :format-value="money" :tooltip="false" total-label="Cash" />
  </OCard>
</template>
