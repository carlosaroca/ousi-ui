<script setup lang="ts">
import { OAnimatedNumber, ODonutChart } from '@ousi-ui/vue'

const data = [
  { label: 'Completed', value: 64, color: 'success' },
  { label: 'In progress', value: 22, color: 'accent' },
  { label: 'Blocked', value: 9, color: 'danger' },
  { label: 'Not started', value: 5, color: '#9ca3af' },
]
</script>
<template>
  <!-- The default slot is the hole: it gets the total and the hovered segment -->
  <ODonutChart :data="data" :size="230" :thickness="15" :gap="3">
    <template #default="{ total, focusedItem }">
      <div class="text-center">
        <div class="flex items-baseline justify-center gap-0.5 text-4xl font-semibold tabular-nums text-ousi-foreground">
          <OAnimatedNumber :value="focusedItem ? focusedItem.percent : data[0].value" animation="count" :duration="300" :format-options="{ maximumFractionDigits: 0 }" />
          <span class="text-xl text-ousi-muted">%</span>
        </div>
        <div class="mt-0.5 text-xs" :style="{ color: focusedItem?.color }">{{ focusedItem ? focusedItem.label : 'Completed' }}</div>
        <div class="text-[11px] text-ousi-muted">{{ focusedItem ? `${focusedItem.value} of ${total}` : `${total} tasks` }}</div>
      </div>
    </template>
  </ODonutChart>
</template>
