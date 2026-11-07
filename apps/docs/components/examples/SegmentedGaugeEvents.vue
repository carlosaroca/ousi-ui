<script setup lang="ts">
import { ref } from 'vue'
import { OSegmentedGauge } from '@ousi-ui/vue'
import type { GaugeItem } from '@ousi-ui/vue'

const segments = [
  { label: 'Move', value: 520, max: 600, color: 'danger', valueLabel: '520 kcal' },
  { label: 'Exercise', value: 24, max: 30, color: 'success', valueLabel: '24 min' },
  { label: 'Stand', value: 7, max: 12, color: 'accent', valueLabel: '7 h' },
]
const picked = ref<GaugeItem | null>(null)
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <OSegmentedGauge :segments="segments" :size="180" :sweep="360" :gap="12" @segment-click="(s) => (picked = s)" />
    <div class="rounded-xl bg-ousi-default px-4 py-3 text-xs">
      <div class="text-ousi-muted">Click a segment</div>
      <div v-if="picked" class="mt-1">
        <div class="text-base font-semibold text-ousi-foreground">{{ picked.label }} · {{ picked.valueLabel }}</div>
        <div class="tabular-nums text-ousi-muted">{{ picked.percent }}% of goal</div>
      </div>
    </div>
  </div>
</template>
