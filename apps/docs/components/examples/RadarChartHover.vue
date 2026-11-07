<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', a: 82, b: 60 }, { label: 'Power', a: 64, b: 78 }, { label: 'Range', a: 91, b: 55 },
  { label: 'Agility', a: 58, b: 84 }, { label: 'Defense', a: 73, b: 66 },
]
const series = [{ key: 'a', label: 'Player A', color: 'accent' }, { key: 'b', label: 'Player B', color: 'orange' }]
const focused = ref<number | null>(null)
const row = computed(() => (focused.value == null ? null : data[focused.value]))
</script>
<template>
  <OCard class="w-full max-w-md items-center gap-3 p-5">
    <div class="w-full">
      <div class="text-sm font-medium text-ousi-muted">{{ row ? row.label : 'Skill comparison' }}</div>
      <div class="mt-1 flex gap-6 text-sm tabular-nums">
        <span v-for="s in series" :key="s.key" class="flex items-center gap-2">
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: `var(--ousi-${s.color})` }" />
          <span class="text-ousi-muted">{{ s.label }}</span>
          <span class="font-semibold text-ousi-foreground">{{ row ? row[s.key as 'a' | 'b'] : '-' }}</span>
        </span>
      </div>
    </div>
    <ORadarChart v-model:focused="focused" :data="data" :series="series" variant="lines" :max="100" :size="200" />
  </OCard>
</template>
