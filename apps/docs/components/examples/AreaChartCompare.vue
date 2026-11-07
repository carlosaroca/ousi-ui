<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

// A dashed series is drawn without fill, so it reads as the reference period.
const data = [
  { m: 'Jan', current: 12400, previous: 10200 }, { m: 'Feb', current: 13800, previous: 11000 },
  { m: 'Mar', current: 13100, previous: 12300 }, { m: 'Apr', current: 15600, previous: 12800 },
  { m: 'May', current: 17200, previous: 13900 }, { m: 'Jun', current: 16800, previous: 14400 },
  { m: 'Jul', current: 19400, previous: 15100 }, { m: 'Aug', current: 21000, previous: 16000 },
]
const usd = (v: number) => `$${(v / 1000).toFixed(0)}k`
</script>
<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-4 text-xs text-ousi-muted">
      <span class="flex items-center gap-1.5"><span class="inline-block h-0.5 w-4 rounded bg-ousi-accent" />This year</span>
      <span class="flex items-center gap-1.5"><span class="inline-block h-0.5 w-4 rounded border-t-2 border-dashed border-ousi-muted" />Last year</span>
    </div>
    <OAreaChart
      :data="data"
      category-key="m"
      :format-value="usd"
      :series="[
        { key: 'previous', label: 'Last year', color: 'var(--ousi-muted)', dashed: true },
        { key: 'current', label: 'This year', color: 'accent' },
      ]"
    />
  </div>
</template>
