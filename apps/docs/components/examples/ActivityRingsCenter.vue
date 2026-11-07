<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 1592, max: 2000, color: 'danger', valueLabel: '1,592 kcal' },
  { label: 'Exercise', value: 105, max: 120, color: 'success', valueLabel: '1h 45m' },
  { label: 'Running', value: 5.2, max: 8, color: 'accent', valueLabel: '5.2 km' },
]
const average = (list: { percent: number }[]) =>
  Math.round(list.reduce((sum, r) => sum + r.percent, 0) / list.length)
</script>
<template>
  <!-- The default slot receives the ring under the pointer, so the center can react. -->
  <OActivityRings :rings="rings" :size="220">
    <template #default="{ focusedRing, rings: items }">
      <div class="text-center">
        <div class="text-2xl font-semibold tabular-nums text-ousi-foreground">
          {{ focusedRing ? focusedRing.percent : average(items) }}%
        </div>
        <div class="mt-0.5 text-xs" :style="{ color: focusedRing?.color }">
          {{ focusedRing ? focusedRing.label : 'Overall' }}
        </div>
        <div v-if="focusedRing" class="text-xs text-ousi-muted">{{ focusedRing.valueLabel }}</div>
      </div>
    </template>
  </OActivityRings>
</template>
