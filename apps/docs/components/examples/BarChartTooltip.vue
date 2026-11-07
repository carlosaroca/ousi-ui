<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { w: 'W1', plan: 120, done: 96 }, { w: 'W2', plan: 140, done: 148 }, { w: 'W3', plan: 130, done: 101 },
  { w: 'W4', plan: 150, done: 152 }, { w: 'W5', plan: 160, done: 118 }, { w: 'W6', plan: 150, done: 163 },
]
</script>
<template>
  <OBarChart :data="data" category-key="w" :bar-radius="8" :series="[{ key: 'plan', label: 'Planned', color: '#9ca3af' }, { key: 'done', label: 'Done', color: 'success' }]">
    <template #tooltip="{ point }">
      <div class="w-40">
        <div class="text-[11px] uppercase tracking-wide text-ousi-muted">{{ point.category }}</div>
        <div class="mt-0.5 text-lg font-semibold tabular-nums" :class="point.values[1].value >= point.values[0].value ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
          {{ Math.round((point.values[1].value / point.values[0].value) * 100) }}%
        </div>
        <div class="text-xs text-ousi-muted">{{ point.values[1].formatted }} of {{ point.values[0].formatted }} planned</div>
        <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-ousi-default">
          <div class="h-full rounded-full" :style="{ width: `${Math.min((point.values[1].value / point.values[0].value) * 100, 100)}%`, backgroundColor: point.values[1].color }" />
        </div>
      </div>
    </template>
  </OBarChart>
</template>
