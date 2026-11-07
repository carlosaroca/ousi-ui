<script setup lang="ts">
import { OSegmentedGauge } from '@ousi-ui/vue'

const segments = [
  { label: 'Duration', value: 49, max: 50, color: 'accent' },
  { label: 'Bedtime', value: 29, max: 30, color: 'violet' },
  { label: 'Interruptions', value: 20, max: 20, color: 'success' },
]
</script>
<template>
  <OSegmentedGauge :segments="segments" :size="220">
    <template #default="{ total, max }">
      <div class="text-center">
        <div class="text-4xl font-semibold tabular-nums text-ousi-foreground">{{ total }}</div>
        <div class="text-xs text-ousi-muted">of {{ max }}</div>
      </div>
    </template>
  </OSegmentedGauge>
</template>
