<script setup lang="ts">
import { OComboChart } from '@ousi-ui/vue'

const data = [
  { d: 'Mon', visits: 320, rate: 12 }, { d: 'Tue', visits: 410, rate: 18 },
  { d: 'Wed', visits: 380, rate: 15 }, { d: 'Thu', visits: 520, rate: 24 },
  { d: 'Fri', visits: 610, rate: 28 }, { d: 'Sat', visits: 290, rate: 14 },
]
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Bars only</p>
      <OComboChart :data="data" category-key="d" :height="180" :bar="{ key: 'visits', label: 'Visits', color: 'var(--ousi-violet)' }" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Linear curve, top-rounded bars, no points</p>
      <OComboChart
        :data="data" category-key="d" :height="180" curve="linear" bar-corners="top" :bar-radius="6" :bar-gap="0.2" :show-points="false"
        :bar="{ key: 'visits', label: 'Visits' }"
        :line="{ key: 'rate', label: 'Rate', format: (v) => `${v}%` }"
      />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Thin bars, no grid, no value axes</p>
      <OComboChart
        :data="data" category-key="d" :height="180" :grid="false" :show-bar-axis="false" :show-line-axis="false" :bar-gap="0.7" :bar-radius="10"
        :bar="{ key: 'visits', label: 'Visits', color: 'var(--ousi-success)' }"
        :line="{ key: 'rate', label: 'Rate', color: 'var(--ousi-danger)', format: (v) => `${v}%` }"
      />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">Static (not interactive)</p>
      <OComboChart
        :data="data" category-key="d" :height="180" :interactive="false"
        :bar="{ key: 'visits', label: 'Visits', color: '#0ea5e9' }"
        :line="{ key: 'rate', label: 'Rate', color: '#f43f5e', format: (v) => `${v}%` }"
      />
    </div>
    <div class="md:col-span-2">
      <p class="mb-2 text-xs text-ousi-muted">Compact: no axes, no grid</p>
      <OComboChart
        :data="data" category-key="d" :height="110" :grid="false"
        :show-x-axis="false" :show-bar-axis="false" :show-line-axis="false"
        :bar="{ key: 'visits', label: 'Visits', color: 'var(--ousi-violet)' }"
        :line="{ key: 'rate', label: 'Rate', color: 'var(--ousi-orange)', format: (v) => `${v}%` }"
      />
    </div>
  </div>
</template>
