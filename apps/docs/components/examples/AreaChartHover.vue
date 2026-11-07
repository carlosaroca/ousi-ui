<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OAreaChart } from '@ousi-ui/vue'

const data = [
  { m: 'Jan', current: 12400, previous: 10200 }, { m: 'Feb', current: 13800, previous: 11000 },
  { m: 'Mar', current: 13100, previous: 12300 }, { m: 'Apr', current: 15600, previous: 12800 },
  { m: 'May', current: 17200, previous: 13900 }, { m: 'Jun', current: 16800, previous: 14400 },
  { m: 'Jul', current: 19400, previous: 15100 }, { m: 'Aug', current: 21000, previous: 16000 },
]
const focused = ref<number | null>(null)
const row = computed(() => (focused.value == null ? null : data[focused.value]))
const ytd = data.reduce((s, r) => s + r.current, 0)
const ytdPrev = data.reduce((s, r) => s + r.previous, 0)
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ row ? `Revenue · ${row.m}` : 'Revenue year to date' }}</div>
        <OAnimatedNumber locale="en-US"
          :value="row ? row.current : ytd"
          :format-options="usd"
          animation="count"
          class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground"
        />
      </div>
      <div class="text-right text-xs text-ousi-muted">
        <div>Last year</div>
        <div class="text-sm font-medium tabular-nums text-ousi-foreground">
          {{ (row ? row.previous : ytdPrev).toLocaleString('en-US', usd) }}
        </div>
      </div>
    </div>
    <OAreaChart
      v-model:focused="focused"
      :data="data"
      category-key="m"
      :height="220"
      :tooltip="false"
      :show-y-axis="false"
      :series="[
        { key: 'previous', label: 'Last year', color: 'var(--ousi-muted)', dashed: true },
        { key: 'current', label: 'This year', color: 'accent' },
      ]"
    />
  </OCard>
</template>
