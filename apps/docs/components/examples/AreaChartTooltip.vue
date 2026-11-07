<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

const data = [
  { m: 'Jan', current: 12400, previous: 10200 }, { m: 'Feb', current: 13800, previous: 11000 },
  { m: 'Mar', current: 13100, previous: 12300 }, { m: 'Apr', current: 15600, previous: 12800 },
  { m: 'May', current: 17200, previous: 13900 }, { m: 'Jun', current: 16800, previous: 14400 },
]
</script>
<template>
  <OAreaChart
    :data="data"
    category-key="m"
    :series="[
      { key: 'previous', label: 'Last year', color: 'var(--ousi-muted)', dashed: true },
      { key: 'current', label: 'This year', color: 'success' },
    ]"
  >
    <template #tooltip="{ point }">
      <div class="w-40">
        <div class="text-[11px] uppercase tracking-wide text-ousi-muted">{{ point.category }}</div>
        <div class="mt-1 text-lg font-semibold tabular-nums text-ousi-foreground">{{ point.values[1].formatted }}</div>
        <div
          class="text-xs font-medium tabular-nums"
          :class="point.values[1].value >= point.values[0].value ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'"
        >
          {{ point.values[1].value >= point.values[0].value ? '▲' : '▼' }}
          {{ Math.abs(Math.round((point.values[1].value / point.values[0].value - 1) * 100)) }}% vs last year
        </div>
      </div>
    </template>
  </OAreaChart>
</template>
