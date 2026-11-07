<script setup lang="ts">
import { OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Visitors', value: 48200, color: '#aee637' },
  { label: 'Sign-ups', value: 18400, color: '#4f8ff7' },
  { label: 'Trials', value: 9200, color: '#b57bff' },
  { label: 'Paid', value: 3100, color: '#ec6fb5' },
]
</script>
<template>
  <div class="flex flex-col gap-10">
    <!-- `stage` replaces the content of each legend tile -->
    <OFunnel :stages="stages" :height="180">
      <template #stage="{ item, focused }">
        <div class="flex items-center justify-between gap-2">
          <span class="flex items-center gap-2 text-sm text-ousi-muted">
            <span class="inline-block size-2.5 rounded-full" :style="{ backgroundColor: item.color }" />{{ item.label }}
          </span>
          <span v-if="item.index > 0" class="text-[11px] tabular-nums" :style="{ color: focused ? item.color : undefined }">{{ item.stepPercent }}%</span>
        </div>
        <div class="mt-1 text-lg font-semibold tabular-nums text-ousi-foreground">{{ (item.value / 1000).toFixed(1) }}k</div>
        <div class="text-[11px] text-ousi-muted">{{ item.index === 0 ? 'top of funnel' : `${100 - item.stepPercent}% drop-off` }}</div>
      </template>
    </OFunnel>

    <!-- Without the legend, using the percentage pills only -->
    <OFunnel :stages="stages" :height="140" :show-legend="false" />

    <!-- In the bars variant `stage` replaces the right side, and `icon` adds content to the pill -->
    <OFunnel :stages="stages" variant="bars">
      <template #icon="{ item }">
        <span class="text-xs font-semibold">{{ item.index + 1 }}</span>
      </template>
      <template #stage="{ item }">
        <span class="text-sm font-semibold tabular-nums text-ousi-foreground">{{ item.formatted }}</span>
        <span class="ml-2 text-xs text-ousi-muted">{{ item.stepPercent }}%</span>
      </template>
    </OFunnel>
  </div>
</template>
