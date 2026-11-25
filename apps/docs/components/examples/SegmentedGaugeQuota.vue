<script setup lang="ts">
import { ref } from 'vue'
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

// A quota per category: the arc is as long as the quota, filled with what is used.
const segments = [
  { label: 'Photos', value: 34, max: 50, color: 'accent' },
  { label: 'Documents', value: 12, max: 30, color: 'violet' },
  { label: 'Videos', value: 52, max: 60, color: 'orange' },
  { label: 'Backups', value: 6, max: 20, color: 'success' },
]
const focused = ref<number | null>(null)
</script>
<template>
  <OCard class="w-full max-w-sm items-center gap-4 p-5">
    <div class="w-full text-sm font-medium text-ousi-muted">Storage plan</div>
    <OSegmentedGauge v-model:focused="focused" :segments="segments" :size="200">
      <template #default="{ total, max, focusedSegment }">
        <div class="text-center">
          <div class="text-3xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? focusedSegment.value : total }}<span class="ml-1 text-sm font-normal text-ousi-muted">GB</span></div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? `of ${focusedSegment.max} GB` : `of ${max} GB used` }}</div>
        </div>
      </template>
    </OSegmentedGauge>
    <ul class="w-full divide-y divide-ousi-border/50 text-sm">
      <li
        v-for="(s, i) in segments"
        :key="s.label"
        class="flex items-center justify-between py-2 transition-opacity"
        :class="focused != null && focused !== i && 'opacity-40'"
        @mouseenter="focused = i"
        @mouseleave="focused = null"
      >
        <span class="flex items-center gap-2 text-ousi-foreground"><span class="size-2 rounded-full" :style="{ backgroundColor: `var(--ousi-${s.color})` }" />{{ s.label }}</span>
        <span class="tabular-nums text-ousi-muted">{{ s.max - s.value }} GB free</span>
      </li>
    </ul>
  </OCard>
</template>
