<script setup lang="ts">
import { OComboChart } from '@ousi-ui/vue'

const data = [
  { month: 'Jan', orders: 420, aov: 38 }, { month: 'Feb', orders: 510, aov: 41 },
  { month: 'Mar', orders: 480, aov: 39 }, { month: 'Apr', orders: 640, aov: 46 },
  { month: 'May', orders: 720, aov: 49 }, { month: 'Jun', orders: 690, aov: 47 },
]
</script>
<template>
  <!-- The tooltip slot receives the resolved point: category, bar, line, datum and x position. -->
  <OComboChart
    :data="data"
    category-key="month"
    :bar="{ key: 'orders', label: 'Orders', color: 'var(--ousi-violet)' }"
    :line="{ key: 'aov', label: 'Avg. order', color: 'var(--ousi-success)', format: (v) => `$${v}` }"
  >
    <template #tooltip="{ point }">
      <div class="w-40">
        <div class="text-[11px] uppercase tracking-wide text-ousi-muted">{{ point.category }}</div>
        <div class="mt-1 text-lg font-semibold tabular-nums text-ousi-foreground">
          ${{ (point.bar.value * (point.line?.value ?? 0)).toLocaleString() }}
        </div>
        <div class="text-xs text-ousi-muted">estimated revenue</div>
        <div class="mt-2 flex justify-between text-xs tabular-nums">
          <span :style="{ color: point.bar.color }">{{ point.bar.formatted }} orders</span>
          <span :style="{ color: point.line?.color }">{{ point.line?.formatted }}</span>
        </div>
      </div>
    </template>
  </OComboChart>
</template>
