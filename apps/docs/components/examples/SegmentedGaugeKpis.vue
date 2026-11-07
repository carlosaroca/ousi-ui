<script setup lang="ts">
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

// sweep=180 draws a half circle. The default slot gets the hovered segment, so no v-model is needed.
const kpis = [
  { label: 'CPU', unit: '%', parts: [{ label: 'User', value: 38, max: 60, color: 'accent' }, { label: 'System', value: 14, max: 40, color: 'violet' }] },
  { label: 'Memory', unit: 'GB', parts: [{ label: 'Apps', value: 9, max: 12, color: 'orange' }, { label: 'Cache', value: 3, max: 4, color: 'warning' }] },
  { label: 'Disk', unit: 'GB', parts: [{ label: 'Data', value: 210, max: 300, color: 'success' }, { label: 'Logs', value: 18, max: 100, color: 'danger' }] },
]
</script>
<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <OCard v-for="k in kpis" :key="k.label" class="items-center gap-1 p-4">
      <OSegmentedGauge :segments="k.parts" :size="150" :sweep="180" :stroke-width="9" :gap="6" class="!h-[88px]">
        <template #default="{ total, focusedSegment }">
          <div class="mt-9 text-center">
            <div class="text-xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? focusedSegment.value : total }}<span class="ml-0.5 text-xs font-normal text-ousi-muted">{{ k.unit }}</span></div>
            <div class="text-[11px] text-ousi-muted">{{ focusedSegment ? focusedSegment.label : k.label }}</div>
          </div>
        </template>
      </OSegmentedGauge>
    </OCard>
  </div>
</template>
