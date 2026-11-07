<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OScatterChart } from '@ousi-ui/vue'
import type { ScatterFocus } from '@ousi-ui/vue'

const series = [
  { label: 'Free', color: 'accent', points: [
    { label: 'Cohort A', x: 2, y: 12 }, { label: 'Cohort B', x: 4, y: 18 }, { label: 'Cohort C', x: 7, y: 25 }, { label: 'Cohort D', x: 10, y: 34 },
  ] },
  { label: 'Pro', color: 'orange', points: [
    { label: 'Cohort E', x: 3, y: 38 }, { label: 'Cohort F', x: 6, y: 52 }, { label: 'Cohort G', x: 9, y: 66 }, { label: 'Cohort H', x: 11, y: 74 },
  ] },
]
const focused = ref<ScatterFocus | null>(null)
const point = computed(() => (focused.value ? series[focused.value.series].points[focused.value.point] : null))
const avg = series.map((s) => s.points.reduce((t, p) => t + p.y, 0) / s.points.length)
</script>
<template>
  <OCard class="w-full max-w-xl gap-4 p-5">
    <div>
      <div class="text-sm font-medium text-ousi-muted">{{ point ? point.label : 'Revenue by usage' }}</div>
      <div class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground">${{ point ? point.y : 742 }}</div>
    </div>
    <!-- Hovering a point dims the other series, so the cohort stands out. -->
    <OScatterChart v-model:focused="focused" :series="series" :height="240" :tooltip="false" :axis-labels="{ x: 'Sessions', y: 'Revenue' }" />
    <div class="flex gap-4 text-xs text-ousi-muted">
      <span v-for="(s, i) in series" :key="s.label" class="flex items-center gap-1.5">
        <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: `var(--ousi-${s.color})` }" />
        {{ s.label }} · avg <span class="font-medium tabular-nums text-ousi-foreground">${{ avg[i].toFixed(0) }}</span>
      </span>
    </div>
  </OCard>
</template>
