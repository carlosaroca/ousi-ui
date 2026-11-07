<script setup lang="ts">
import { ref } from 'vue'
import { ODonutChart } from '@ousi-ui/vue'
import type { DonutItem } from '@ousi-ui/vue'

const data = [
  { label: 'Chrome', value: 64, color: 'accent' }, { label: 'Safari', value: 19, color: 'violet' },
  { label: 'Edge', value: 6, color: 'success' }, { label: 'Firefox', value: 4, color: 'orange' },
  { label: 'Other', value: 7, color: '#9ca3af' },
]
const selected = ref<DonutItem | null>(null)
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <ODonutChart :data="data" :size="190" show-legend class="w-64" @segment-click="(s) => (selected = selected?.key === s.key ? null : s)" />
    <div class="min-w-48 rounded-xl bg-ousi-default px-4 py-3 text-xs">
      <div class="text-ousi-muted">Click a segment</div>
      <div v-if="selected" class="mt-1">
        <div class="flex items-center gap-2 text-base font-semibold text-ousi-foreground">
          <span class="inline-block size-2.5 rounded-full" :style="{ backgroundColor: selected.color }" />{{ selected.label }}
        </div>
        <div class="tabular-nums text-ousi-muted">{{ selected.formatted }} users · {{ selected.percent }}%</div>
      </div>
    </div>
  </div>
</template>
