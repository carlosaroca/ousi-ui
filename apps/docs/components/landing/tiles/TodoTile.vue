<script setup lang="ts">
import { computed } from 'vue'
import { OCheckbox } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { t } = useShowcase()

const tasks = ['Wireframe the hero', 'Pick a type scale', 'Build the grid', 'Write the docs', 'Ship it']
const CYCLE = 8

// One task gets ticked every 0.9 s, the list holds for a moment, then it empties and starts again.
const done = computed(() => {
  const p = t.value % CYCLE
  if (p >= 6.6) return 0
  return Math.min(tasks.length, Math.max(0, Math.floor((p - 0.5) / 0.9) + 1))
})
</script>

<template>
  <ShowcaseTile class="grow">
    <div class="mb-3 flex items-baseline justify-between">
      <span class="text-sm font-semibold text-ousi-foreground">Today</span>
      <span class="text-[11px] tabular-nums text-ousi-muted">{{ done }} of {{ tasks.length }} done</span>
    </div>
    <ul class="flex flex-col gap-2">
      <li v-for="(task, i) in tasks" :key="task" class="flex items-center gap-3 rounded-xl bg-ousi-surface px-3 py-2.5">
        <OCheckbox :model-value="i < done" size="sm" />
        <span
          class="truncate text-xs transition-colors duration-300"
          :class="i < done ? 'text-ousi-muted line-through' : 'text-ousi-foreground'"
        >{{ task }}</span>
      </li>
    </ul>
  </ShowcaseTile>
</template>
