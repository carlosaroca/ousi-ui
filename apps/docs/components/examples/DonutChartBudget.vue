<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODonutChart } from '@ousi-ui/vue'
import type { DonutItem } from '@ousi-ui/vue'

const periods = {
  Monthly: [
    { label: 'Housing', value: 1400, color: '#4f8ff7' }, { label: 'Food', value: 620, color: '#aee637' },
    { label: 'Transport', value: 280, color: '#b57bff' }, { label: 'Leisure', value: 340, color: '#ec6fb5' },
    { label: 'Savings', value: 1360, color: '#f2b93b' },
  ],
  Yearly: [
    { label: 'Housing', value: 16800, color: '#4f8ff7' }, { label: 'Food', value: 7600, color: '#aee637' },
    { label: 'Transport', value: 3900, color: '#b57bff' }, { label: 'Leisure', value: 5200, color: '#ec6fb5' },
    { label: 'Savings', value: 16300, color: '#f2b93b' },
  ],
} as const
type Period = keyof typeof periods

const period = ref<Period>('Monthly')
const focused = ref<number | null>(null)
const data = computed(() => periods[period.value])
const total = computed(() => data.value.reduce((s, d) => s + d.value, 0))
const active = computed(() => (focused.value == null ? null : data.value[focused.value]))
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-xl gap-4 p-5">
    <div class="flex items-start justify-between">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Spending' }}</div>
        <OAnimatedNumber locale="en-US" :value="active ? active.value : total" :format-options="usd" animation="count" :duration="300" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="(_, p) in periods" :key="p" type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="period === p ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="period = p as Period"
        >{{ p }}</button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-6">
      <ODonutChart v-model:focused="focused" :data="data" :size="180" :thickness="14" :gap="3" rounded>
        <template #default="{ focusedItem }">
          <div class="text-center">
            <div class="text-2xl font-semibold tabular-nums text-ousi-foreground">{{ focusedItem ? `${focusedItem.percent}%` : '100%' }}</div>
            <div class="text-xs text-ousi-muted">{{ focusedItem ? focusedItem.label : 'of income' }}</div>
          </div>
        </template>
      </ODonutChart>

      <!-- Custom legend rows with a progress bar; they share the focus with the chart -->
      <ul class="min-w-48 flex-1 space-y-2.5">
        <li
          v-for="(d, i) in data" :key="d.label"
          class="cursor-default transition-opacity" :class="focused != null && focused !== i && 'opacity-40'"
          @mouseenter="focused = i" @mouseleave="focused = null"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="flex items-center gap-2 text-ousi-foreground"><span class="inline-block size-2.5 rounded-full" :style="{ backgroundColor: d.color }" />{{ d.label }}</span>
            <span class="tabular-nums text-ousi-muted">{{ d.value.toLocaleString('en-US', usd) }}</span>
          </div>
          <div class="mt-1 h-1 overflow-hidden rounded-full bg-ousi-default">
            <div class="h-full rounded-full transition-all duration-500" :style="{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color }" />
          </div>
        </li>
      </ul>
    </div>
  </OCard>
</template>
