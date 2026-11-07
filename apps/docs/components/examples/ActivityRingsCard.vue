<script setup lang="ts">
import { computed, ref } from 'vue'
import { OActivityRings, OCard, OCardContent, OCardDescription, OCardHeader, OCardTitle } from '@ousi-ui/vue'

const days = [
  { id: 'Mon', move: 1240, exercise: 48, running: 2.1 },
  { id: 'Tue', move: 1810, exercise: 92, running: 4.6 },
  { id: 'Wed', move: 960, exercise: 31, running: 0 },
  { id: 'Thu', move: 2120, exercise: 125, running: 7.9 },
  { id: 'Fri', move: 1592, exercise: 105, running: 5.2 },
  { id: 'Sat', move: 2480, exercise: 140, running: 9.4 },
  { id: 'Sun', move: 700, exercise: 20, running: 0 },
]
const day = ref('Fri')
const focused = ref<string | null>(null)

const rings = computed(() => {
  const d = days.find((x) => x.id === day.value)!
  return [
    { label: 'Move', value: d.move, max: 2000, color: 'danger', valueLabel: `${d.move.toLocaleString()} kcal` },
    { label: 'Exercise', value: d.exercise, max: 120, color: 'success', valueLabel: `${Math.floor(d.exercise / 60)}h ${d.exercise % 60}m` },
    { label: 'Running', value: d.running, max: 8, color: 'accent', valueLabel: `${d.running} km` },
  ]
})
</script>
<template>
  <OCard class="w-96">
    <OCardHeader>
      <OCardTitle>Activity</OCardTitle>
      <OCardDescription>Pick a day to compare your goals</OCardDescription>
    </OCardHeader>
    <OCardContent class="flex flex-col items-center gap-5">
      <div class="flex w-full justify-between">
        <button
          v-for="d in days"
          :key="d.id"
          type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="day === d.id ? 'bg-ousi-foreground text-ousi-background' : 'text-ousi-muted hover:bg-ousi-default'"
          @click="day = d.id"
        >
          {{ d.id }}
        </button>
      </div>

      <OActivityRings v-model:focused="focused" :rings="rings" :size="180" show-stats class="w-full">
        <template #default="{ focusedRing }">
          <div class="text-center">
            <div class="text-2xl font-semibold tabular-nums text-ousi-foreground">
              {{ focusedRing ? focusedRing.percent : day }}{{ focusedRing ? '%' : '' }}
            </div>
            <div class="text-xs text-ousi-muted">{{ focusedRing ? focusedRing.label : 'Selected day' }}</div>
          </div>
        </template>
      </OActivityRings>
    </OCardContent>
  </OCard>
</template>
