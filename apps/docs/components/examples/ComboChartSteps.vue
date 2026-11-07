<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OComboChart } from '@ousi-ui/vue'

const weeks = [
  { period: '22 – 28 Jun', rows: [4200, 6100, 5400, 7800, 6600, 9200, 3800] },
  { period: '29 Jun – 5 Jul', rows: [3800, 5200, 4700, 5900, 6400, 3300, 2300] },
  { period: '6 – 12 Jul', rows: [5100, 6800, 7200, 6400, 8100, 10400, 6900] },
]
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const week = ref(1)

const data = computed(() => weeks[week.value].rows.map((v, i) => ({ d: days[i], v })))
const total = computed(() => weeks[week.value].rows.reduce((s, v) => s + v, 0))
</script>
<template>
  <OCard class="w-full max-w-md gap-5 p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <span class="text-sm font-medium text-ousi-muted">Steps</span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="grid size-7 place-items-center rounded-full bg-ousi-default text-ousi-foreground disabled:opacity-40"
          :disabled="week === 0"
          aria-label="Previous week"
          @click="week--"
        >
          <svg viewBox="0 0 12 12" class="size-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 3 4.5 6l3 3" /></svg>
        </button>
        <span class="min-w-24 text-center text-xs font-medium tabular-nums text-ousi-foreground">{{ weeks[week].period }}</span>
        <button
          type="button"
          class="grid size-7 place-items-center rounded-full bg-ousi-default text-ousi-foreground disabled:opacity-40"
          :disabled="week === weeks.length - 1"
          aria-label="Next week"
          @click="week++"
        >
          <svg viewBox="0 0 12 12" class="size-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3 7.5 6l-3 3" /></svg>
        </button>
      </div>
    </div>

    <div class="flex items-baseline gap-2">
      <OAnimatedNumber :value="total" animation="count" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
      <span class="text-sm text-ousi-muted">total steps</span>
    </div>

    <OComboChart
      :data="data"
      category-key="d"
      :height="200"
      :show-bar-axis="false"
      :bar-gap="0.5"
      :bar="{ key: 'v', label: 'Steps', color: 'var(--ousi-accent)' }"
    />
  </OCard>
</template>
