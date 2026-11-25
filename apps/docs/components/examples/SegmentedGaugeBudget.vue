<script setup lang="ts">
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const teams = [
  { name: 'Marketing', spent: 42, budget: 50, color: 'accent' },
  { name: 'Product', spent: 61, budget: 55, color: 'violet' },
  { name: 'Operations', spent: 18, budget: 30, color: 'success' },
  { name: 'Sales', spent: 33, budget: 40, color: 'orange' },
]
const isOver = (t: (typeof teams)[number]) => t.spent > t.budget
// Over its limit a segment comes out full, no longer: the color and the list say by how much.
const segments = teams.map((t) => ({ label: t.name, value: t.spent, max: t.budget, color: isOver(t) ? 'danger' : t.color }))
const over = teams.filter(isOver).length
</script>
<template>
  <OCard class="w-full max-w-xl flex-row flex-wrap items-center gap-6 p-5">
    <OSegmentedGauge :segments="segments" :size="190">
      <template #default="{ total, max, focusedSegment }">
        <div class="text-center">
          <div class="text-3xl font-semibold tabular-nums text-ousi-foreground">${{ focusedSegment ? focusedSegment.value : total }}k</div>
          <div class="text-xs text-ousi-muted">{{ focusedSegment ? focusedSegment.label : `of $${max}k` }}</div>
        </div>
      </template>
    </OSegmentedGauge>
    <div class="min-w-52 flex-1">
      <p class="mb-2 text-sm font-medium" :class="over ? 'text-ousi-danger' : 'text-ousi-foreground'">{{ over ? `${over} team over budget` : 'All within budget' }}</p>
      <ul class="space-y-2 text-sm">
        <li v-for="(t, i) in teams" :key="t.name" class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-2 text-ousi-muted"><span class="size-2 rounded-full" :style="{ backgroundColor: `var(--ousi-${segments[i].color})` }" />{{ t.name }}</span>
          <span class="tabular-nums" :class="isOver(t) ? 'font-medium text-ousi-danger' : 'text-ousi-muted'">{{ isOver(t) ? `$${t.spent - t.budget}k over` : `$${t.spent}k of $${t.budget}k` }}</span>
        </li>
      </ul>
    </div>
  </OCard>
</template>
