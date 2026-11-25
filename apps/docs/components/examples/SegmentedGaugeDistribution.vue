<script setup lang="ts">
import { ref } from 'vue'
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const priorities = [
  { label: 'Critical', count: 3, color: 'danger' },
  { label: 'High', count: 128, color: 'orange' },
  { label: 'Medium', count: 640, color: 'warning' },
  { label: 'Low', count: 285, color: 'success' },
  { label: 'No priority', count: 96, color: 'var(--ousi-muted)' },
]
// Parts of a total: each max is its own value, so each arc takes its share and comes out full.
const segments = priorities.map((p) => ({ label: p.label, value: p.count, max: p.count, color: p.color }))
const total = priorities.reduce((sum, p) => sum + p.count, 0)
const focused = ref<number | null>(null)

// A tiny part is drawn bigger than it is, so the numbers carry the truth.
const share = (count: number) => (count / total < 0.01 ? '<1%' : `${Math.round((count / total) * 100)}%`)
const dot = (color: string) => (color.startsWith('var') ? color : `var(--ousi-${color})`)
</script>
<template>
  <OCard class="w-full max-w-xl flex-row flex-wrap items-center gap-6 p-5">
    <OSegmentedGauge v-model:focused="focused" :segments="segments" :size="190">
      <template #default="{ focusedSegment }">
        <div class="text-center">
          <div class="text-3xl font-semibold tabular-nums text-ousi-foreground">{{ (focusedSegment ? focusedSegment.value : total).toLocaleString('en-US') }}</div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? focusedSegment.label : 'open tickets' }}</div>
        </div>
      </template>
    </OSegmentedGauge>
    <ul class="min-w-52 flex-1 space-y-2 text-sm">
      <li
        v-for="(p, i) in priorities"
        :key="p.label"
        class="flex items-center justify-between gap-3 transition-opacity"
        :class="focused != null && focused !== i && 'opacity-40'"
        @mouseenter="focused = i"
        @mouseleave="focused = null"
      >
        <span class="flex items-center gap-2 text-ousi-muted"><span class="size-2 rounded-full" :style="{ backgroundColor: dot(p.color) }" />{{ p.label }}</span>
        <span class="tabular-nums"><b class="font-semibold text-ousi-foreground">{{ p.count }}</b> <span class="inline-block w-10 text-right text-ousi-muted">{{ share(p.count) }}</span></span>
      </li>
    </ul>
  </OCard>
</template>
