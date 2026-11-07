<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OComboChart } from '@ousi-ui/vue'

const ranges = ['Weekly', 'Monthly', 'Yearly'] as const
const sets = {
  Weekly: { delta: 14.8, rows: [
    { l: 'Mon', v: 820 }, { l: 'Tue', v: 1140 }, { l: 'Wed', v: 960 }, { l: 'Thu', v: 1480 },
    { l: 'Fri', v: 1320 }, { l: 'Sat', v: 1050 }, { l: 'Sun', v: 692 },
  ] },
  Monthly: { delta: 9.2, rows: [
    { l: 'W1', v: 6200 }, { l: 'W2', v: 7400 }, { l: 'W3', v: 6900 }, { l: 'W4', v: 8800 },
  ] },
  Yearly: { delta: 21.5, rows: [
    { l: 'Q1', v: 58000 }, { l: 'Q2', v: 71000 }, { l: 'Q3', v: 66000 }, { l: 'Q4', v: 92000 },
  ] },
} as const

const range = ref<(typeof ranges)[number]>('Weekly')
const focused = ref<number | null>(null)

const set = computed(() => sets[range.value])
const total = computed(() => set.value.rows.reduce((s, r) => s + r.v, 0))
const active = computed(() => (focused.value == null ? null : set.value.rows[focused.value]))
</script>
<template>
  <!-- The header is plain markup: change it however you like. -->
  <OCard class="w-full max-w-md gap-5 p-5">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-ousi-muted">
        {{ active ? `Earned · ${active.l}` : 'Earned so far' }}
      </span>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="r in ranges"
          :key="r"
          type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="range === r ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="range = r"
        >
          {{ r }}
        </button>
      </div>
    </div>

    <div class="flex items-baseline gap-3">
      <OAnimatedNumber locale="en-US"
        :value="active ? active.v : total"
        :format-options="{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }"
        animation="count"
        class="text-3xl font-semibold tabular-nums text-ousi-foreground"
      />
      <span class="rounded-full bg-ousi-success/15 px-2 py-0.5 text-xs font-medium tabular-nums text-ousi-success-soft-strong">
        +{{ set.delta }}%
      </span>
    </div>

    <OComboChart
      v-model:focused="focused"
      :data="set.rows"
      category-key="l"
      :height="200"
      :show-bar-axis="false"
      :tooltip="false"
      :bar="{ key: 'v', label: 'Earnings', color: 'var(--ousi-success)' }"
    />
  </OCard>
</template>
