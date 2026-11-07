<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OBarChart, OCard } from '@ousi-ui/vue'

const sets = {
  Weekly: { delta: 14.8, ticks: [0, 500, 1000, 1500], rows: [
    { l: 'Mon', v: 820 }, { l: 'Tue', v: 1140 }, { l: 'Wed', v: 960 }, { l: 'Thu', v: 1480 },
    { l: 'Fri', v: 1320 }, { l: 'Sat', v: 1050 }, { l: 'Sun', v: 692 },
  ] },
  Monthly: { delta: 9.2, ticks: [0, 3000, 5000, 10000], rows: [
    { l: 'Jan', v: 3100 }, { l: 'Feb', v: 6900 }, { l: 'Mar', v: 9650 }, { l: 'Apr', v: 6400 }, { l: 'May', v: 3600 }, { l: 'Jun', v: 2400 },
    { l: 'Jul', v: 3800 }, { l: 'Aug', v: 5100 }, { l: 'Sep', v: 6600 }, { l: 'Oct', v: 4700 }, { l: 'Nov', v: 11400 }, { l: 'Dec', v: 7900 },
  ] },
  Yearly: { delta: 21.5, ticks: [0, 25000, 50000, 100000], rows: [
    { l: '2021', v: 38000 }, { l: '2022', v: 56000 }, { l: '2023', v: 71000 }, { l: '2024', v: 92000 }, { l: '2025', v: 104000 },
  ] },
} as const
type Range = keyof typeof sets

const range = ref<Range>('Monthly')
const focused = ref<number | null>(null)
const set = computed(() => sets[range.value])
const total = computed(() => set.value.rows.reduce((s, r) => s + r.v, 0))
const active = computed(() => (focused.value == null ? null : set.value.rows[focused.value]))
const short = (v: number) => (v >= 1000 ? `$${v / 1000}K` : `$${v}`)
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-3xl gap-5 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ active ? `Earned · ${active.l}` : 'Earned so far' }}</div>
        <div class="mt-1 flex items-center gap-3">
          <OAnimatedNumber locale="en-US" :value="active ? active.v : total" :format-options="usd" animation="count" :duration="300" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
          <span class="rounded-lg bg-ousi-success/20 px-2 py-0.5 text-sm font-medium tabular-nums text-ousi-success-soft-strong">+{{ set.delta }}%</span>
        </div>
      </div>
      <div class="flex gap-1">
        <button
          v-for="(_, r) in sets" :key="r" type="button"
          class="rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors"
          :class="range === r ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="range = r as Range"
        >{{ r }}</button>
      </div>
    </div>
    <OBarChart
      :key="range"
      v-model:focused="focused"
      :data="set.rows"
      category-key="l"
      :series="[{ key: 'v', label: 'Earned', color: '#aee637' }]"
      track
      :ticks="[...set.ticks]"
      :height="300"
      :tooltip="false"
      :format-value="short"
    />
  </OCard>
</template>
