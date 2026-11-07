<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OAreaChart, OCard } from '@ousi-ui/vue'

const rand = (seed: number) => { const x = Math.sin(seed * 78.233) * 43758.5453; return x - Math.floor(x) }
// Deterministic random walk
function walk(n: number, start: number, vol: number, seed: number, drift: number) {
  let v = start
  return Array.from({ length: n }, (_, i) => { v += (rand(seed + i) - 0.5 + drift) * vol; return Math.round(v * 100) / 100 })
}
const sets = {
  '1D': { labels: Array.from({ length: 12 }, (_, i) => `${9 + i}:00`), data: walk(12, 182, 1.6, 3, 0.05) },
  '1W': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: walk(5, 178, 4, 11, -0.1) },
  '1M': { labels: Array.from({ length: 20 }, (_, i) => `Jun ${i + 1}`), data: walk(20, 170, 3, 21, 0.12) },
  '1Y': { labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: walk(12, 140, 9, 31, 0.2) },
} as const
type Range = keyof typeof sets

const range = ref<Range>('1M')
const focused = ref<number | null>(null)
const rows = computed(() => sets[range.value].data.map((price, i) => ({ t: sets[range.value].labels[i], price })))
const first = computed(() => rows.value[0].price)
const price = computed(() => (focused.value == null ? rows.value[rows.value.length - 1] : rows.value[focused.value]).price)
const change = computed(() => ((price.value - first.value) / first.value) * 100)
const up = computed(() => change.value >= 0)
const usd = { style: 'currency', currency: 'USD' } as const
</script>
<template>
  <OCard class="w-full max-w-2xl gap-4 p-5">
    <div class="flex items-start justify-between">
      <div>
        <div class="text-sm font-medium text-ousi-muted">ACME · {{ focused == null ? 'Price' : rows[focused].t }}</div>
        <div class="mt-1 flex items-baseline gap-3">
          <OAnimatedNumber locale="en-US" :value="price" :format-options="usd" animation="count" :duration="250" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
          <span class="text-sm font-medium tabular-nums" :class="up ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
            {{ up ? '▲' : '▼' }} {{ Math.abs(change).toFixed(2) }}%
          </span>
        </div>
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="(_, r) in sets" :key="r" type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="range === r ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="range = r as Range"
        >{{ r }}</button>
      </div>
    </div>
    <!-- The line turns red or green with the trend of the selected range -->
    <OAreaChart
      :key="range"
      v-model:focused="focused"
      :data="rows"
      category-key="t"
      :height="240"
      baseline="auto"
      :tooltip="false"
      :show-x-axis="false"
      :format-value="(v) => `$${v.toFixed(0)}`"
      :series="[{ key: 'price', label: 'Price', color: up ? 'success' : 'danger' }]"
    />
  </OCard>
</template>
