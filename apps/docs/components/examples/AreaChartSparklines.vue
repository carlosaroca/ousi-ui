<script setup lang="ts">
import { OAreaChart, OCard } from '@ousi-ui/vue'

const spark = (vals: number[]) => vals.map((v, i) => ({ i, v }))
const kpis = [
  { label: 'Revenue', value: '$48.2k', delta: 12.4, color: 'success', data: spark([22, 26, 24, 30, 28, 35, 38, 42, 40, 48]) },
  { label: 'Sessions', value: '128k', delta: 4.1, color: 'accent', data: spark([60, 58, 66, 64, 70, 68, 75, 72, 80, 84]) },
  { label: 'Churn', value: '2.1%', delta: -0.6, color: 'violet', invert: true, data: spark([34, 32, 33, 30, 29, 30, 27, 25, 24, 22]) },
  { label: 'Refunds', value: '$1.9k', delta: 8.2, color: 'danger', invert: true, data: spark([10, 12, 11, 14, 13, 16, 15, 18, 17, 19]) },
]
const good = (k: { delta: number; invert?: boolean }) => (k.invert ? k.delta <= 0 : k.delta >= 0)
</script>
<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <OCard v-for="k in kpis" :key="k.label" class="gap-1 p-4">
      <div class="text-xs font-medium text-ousi-muted">{{ k.label }}</div>
      <div class="flex items-baseline justify-between">
        <span class="text-xl font-semibold tabular-nums text-ousi-foreground">{{ k.value }}</span>
        <span class="text-xs font-medium tabular-nums" :class="good(k) ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
          {{ k.delta > 0 ? '+' : '' }}{{ k.delta }}%
        </span>
      </div>
      <!-- A sparkline is just an area chart without axes, grid or interaction -->
      <OAreaChart
        :data="k.data" category-key="i" :height="56" baseline="auto" :interactive="false"
        :show-x-axis="false" :show-y-axis="false" :grid="false" :fill-opacity="0.35"
        :padding="{ top: 6, right: 2, bottom: 2, left: 2 }"
        :series="[{ key: 'v', color: k.color, strokeWidth: 2 }]"
      />
    </OCard>
  </div>
</template>
