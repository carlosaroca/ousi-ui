<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const segments = [
  { label: 'Duration', value: 49, max: 50, color: 'accent', valueLabel: '7h 50m' },
  { label: 'Bedtime', value: 29, max: 30, color: 'violet', valueLabel: '20m earlier' },
  { label: 'Interruptions', value: 20, max: 20, color: 'success', valueLabel: '5m awake' },
]
const focused = ref<number | null>(null)
const status = computed(() => (focused.value == null ? 'Excellent' : segments[focused.value].label))
</script>
<template>
  <OCard class="w-full max-w-sm items-center gap-5 p-5">
    <div class="w-full text-sm font-medium text-ousi-muted">Sleep score · {{ status }}</div>
    <OSegmentedGauge v-model:focused="focused" :segments="segments" :size="200">
      <template #default="{ total, focusedSegment }">
        <div class="text-center">
          <div class="text-4xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? focusedSegment.value : total }}</div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? `of ${focusedSegment.max}` : 'of 100' }}</div>
        </div>
      </template>
    </OSegmentedGauge>

    <!-- The rows share v-model:focused with the gauge -->
    <ul class="w-full divide-y divide-ousi-border/50">
      <li
        v-for="(s, i) in segments"
        :key="s.label"
        class="flex cursor-default items-center justify-between py-2.5 text-sm transition-opacity"
        :class="focused != null && focused !== i && 'opacity-40'"
        @mouseenter="focused = i"
        @mouseleave="focused = null"
      >
        <span class="flex items-center gap-2 text-ousi-foreground">
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: `var(--ousi-${s.color})` }" />{{ s.label }}
        </span>
        <span class="tabular-nums text-ousi-muted">{{ s.valueLabel }} · <span class="font-medium text-ousi-foreground">{{ s.value }}/{{ s.max }}</span></span>
      </li>
    </ul>
  </OCard>
</template>
