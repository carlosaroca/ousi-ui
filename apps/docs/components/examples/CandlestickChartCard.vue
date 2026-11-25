<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCandlestickChart, OCard, OTabs } from '@ousi-ui/vue'

function prices(count: number, start: number, seed: number) {
  let last = start
  let state = seed
  const random = () => ((state = (state * 48271) % 2147483647) / 2147483647)
  return Array.from({ length: count }, (_, i) => {
    const open = last
    const close = Math.round((open + (random() - 0.46) * 9) * 100) / 100
    last = close
    return {
      label: `${i + 1} Jun`,
      open,
      high: Math.round((Math.max(open, close) + random() * 4) * 100) / 100,
      low: Math.round((Math.min(open, close) - random() * 4) * 100) / 100,
      close,
      volume: Math.round(40000 + random() * 160000),
    }
  })
}

const month = prices(30, 188, 21)
const range = ref('30')
const ranges = [{ key: '10', label: '10D' }, { key: '20', label: '20D' }, { key: '30', label: '30D' }]
const data = computed(() => month.slice(-Number(range.value)))

const focused = ref<number | null>(null)
const shown = computed(() => data.value[focused.value ?? data.value.length - 1])
const since = computed(() => ((shown.value.close - data.value[0].open) / data.value[0].open) * 100)
</script>
<template>
  <OCard class="w-full min-w-0 max-w-xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-xs font-medium text-ousi-muted">ACME · {{ shown.label }}</div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-semibold tabular-nums text-ousi-foreground">${{ shown.close.toFixed(2) }}</span>
          <span class="text-sm font-medium tabular-nums" :class="since >= 0 ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
            {{ since >= 0 ? '+' : '' }}{{ since.toFixed(2) }}%
          </span>
        </div>
      </div>
      <OTabs v-model="range" :items="ranges" size="sm" />
    </div>
    <OCandlestickChart v-model:focused="focused" :data="data" :height="280" show-volume />
  </OCard>
</template>
