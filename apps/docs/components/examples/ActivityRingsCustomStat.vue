<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 1592, max: 2000, color: 'danger', valueLabel: '1,592 kcal' },
  { label: 'Exercise', value: 105, max: 120, color: 'success', valueLabel: '1h 45m' },
  { label: 'Running', value: 5.2, max: 8, color: 'accent', valueLabel: '5.2 km' },
]
</script>
<template>
  <!-- `stat` replaces the content of each legend item; the wrapper keeps hover and keyboard behavior. -->
  <OActivityRings :rings="rings" :size="160" show-stats class="w-80">
    <template #stat="{ ring, focused }">
      <div class="w-24">
        <div class="flex items-baseline justify-between gap-2">
          <span class="text-xs text-ousi-muted">{{ ring.label }}</span>
          <span class="text-xs font-medium tabular-nums" :style="{ color: ring.color }">{{ ring.percent }}%</span>
        </div>
        <div class="mt-1 h-1 overflow-hidden rounded-full bg-ousi-default">
          <div
            class="h-full rounded-full transition-all duration-300"
            :style="{ width: `${ring.percent}%`, backgroundColor: ring.color, opacity: focused ? 1 : 0.7 }"
          />
        </div>
        <div class="mt-1.5 text-sm font-semibold tabular-nums text-ousi-foreground">{{ ring.valueLabel }}</div>
      </div>
    </template>
  </OActivityRings>
</template>
