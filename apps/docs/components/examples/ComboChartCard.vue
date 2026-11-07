<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OComboChart } from '@ousi-ui/vue'

const periods = {
  '7d': [
    { d: 'Mon', sessions: 3200, conv: 3.1 }, { d: 'Tue', sessions: 3900, conv: 3.4 },
    { d: 'Wed', sessions: 3500, conv: 3.0 }, { d: 'Thu', sessions: 4400, conv: 3.9 },
    { d: 'Fri', sessions: 5100, conv: 4.2 }, { d: 'Sat', sessions: 2800, conv: 2.7 },
    { d: 'Sun', sessions: 2400, conv: 2.5 },
  ],
  '30d': [
    { d: 'W1', sessions: 18200, conv: 3.2 }, { d: 'W2', sessions: 20400, conv: 3.5 },
    { d: 'W3', sessions: 19100, conv: 3.3 }, { d: 'W4', sessions: 25500, conv: 4.1 },
  ],
  '90d': [
    { d: 'Aug', sessions: 61000, conv: 3.0 }, { d: 'Sep', sessions: 72400, conv: 3.6 },
    { d: 'Oct', sessions: 83200, conv: 3.9 },
  ],
} as const
type Period = keyof typeof periods

const period = ref<Period>('30d')
const focused = ref<number | null>(null)
const data = computed(() => periods[period.value])
const active = computed(() => (focused.value == null ? null : data.value[focused.value]))

const total = computed(() => data.value.reduce((s, r) => s + r.sessions, 0))
const avgConv = computed(() => data.value.reduce((s, r) => s + r.conv, 0) / data.value.length)
const delta = computed(() => {
  const rows = data.value
  const half = Math.floor(rows.length / 2)
  const prev = rows.slice(0, half).reduce((s, r) => s + r.sessions, 0) / half
  const next = rows.slice(half).reduce((s, r) => s + r.sessions, 0) / (rows.length - half)
  return ((next - prev) / prev) * 100
})
</script>
<template>
  <OCard class="w-full max-w-2xl gap-5 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">
          {{ active ? `Sessions · ${active.d}` : 'Traffic & conversion' }}
        </div>
        <div class="mt-2 flex items-baseline gap-3">
          <OAnimatedNumber
            :value="active ? active.sessions : total"
            animation="count"
            class="text-3xl font-semibold tabular-nums text-ousi-foreground"
          />
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium tabular-nums"
            :class="delta >= 0 ? 'bg-ousi-success/15 text-ousi-success-soft-strong' : 'bg-ousi-danger/15 text-ousi-danger-soft-strong'"
          >
            {{ delta >= 0 ? '+' : '' }}{{ delta.toFixed(1) }}%
          </span>
        </div>
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="p in (Object.keys(periods) as Period[])"
          :key="p"
          type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="period === p ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="period = p"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <OComboChart
      v-model:focused="focused"
      :data="data"
      category-key="d"
      :height="240"
      :tooltip="false"
      :bar="{ key: 'sessions', label: 'Sessions', color: 'var(--ousi-accent)' }"
      :line="{ key: 'conv', label: 'Conversion', color: 'var(--ousi-orange)', format: (v) => `${v}%` }"
    />

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-2xl bg-ousi-default px-4 py-3">
        <div class="text-xs text-ousi-muted">Total sessions</div>
        <div class="mt-0.5 text-lg font-semibold tabular-nums text-ousi-foreground">{{ total.toLocaleString() }}</div>
      </div>
      <div class="rounded-2xl bg-ousi-default px-4 py-3">
        <div class="text-xs text-ousi-muted">Avg. conversion</div>
        <div class="mt-0.5 text-lg font-semibold tabular-nums text-ousi-foreground">{{ avgConv.toFixed(1) }}%</div>
      </div>
    </div>
  </OCard>
</template>
