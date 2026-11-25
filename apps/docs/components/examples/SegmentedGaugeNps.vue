<script setup lang="ts">
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const answers = [
  { label: 'Detractors', value: 60, color: 'danger' },
  { label: 'Passives', value: 115, color: 'warning' },
  { label: 'Promoters', value: 325, color: 'success' },
]
const segments = answers.map((a) => ({ ...a, max: a.value }))
const total = answers.reduce((sum, a) => sum + a.value, 0)
const percent = (value: number) => Math.round((value / total) * 100)
const score = Math.round(((answers[2].value - answers[0].value) / total) * 100)
</script>
<template>
  <OCard class="w-full max-w-xs items-center gap-3 p-5">
    <div class="w-full text-sm font-medium text-ousi-muted">Net Promoter Score</div>
    <!-- joined: one band, for a single answer split in three. -->
    <OSegmentedGauge :segments="segments" :size="200" :sweep="180" joined class="!h-[112px]">
      <template #default="{ focusedSegment }">
        <div class="mt-12 text-center">
          <div class="text-4xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? `${percent(focusedSegment.value)}%` : score }}</div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? focusedSegment.label : `${total} answers` }}</div>
        </div>
      </template>
    </OSegmentedGauge>
    <ul class="grid w-full grid-cols-3 gap-2 text-center">
      <li v-for="a in answers" :key="a.label">
        <div class="text-sm font-semibold tabular-nums text-ousi-foreground">{{ percent(a.value) }}%</div>
        <div class="flex items-center justify-center gap-1.5 text-[11px] text-ousi-muted"><span class="size-1.5 rounded-full" :style="{ backgroundColor: `var(--ousi-${a.color})` }" />{{ a.label }}</div>
      </li>
    </ul>
  </OCard>
</template>
