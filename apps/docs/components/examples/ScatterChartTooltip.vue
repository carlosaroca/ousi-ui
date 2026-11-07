<script setup lang="ts">
import { OScatterChart } from '@ousi-ui/vue'

const series = [
  { label: 'Plan A', color: 'violet', points: [
    { label: 'Acme', x: 12, y: 340, z: 8 }, { label: 'Globex', x: 28, y: 520, z: 15 }, { label: 'Initech', x: 41, y: 610, z: 22 },
  ] },
  { label: 'Plan B', color: 'success', points: [
    { label: 'Umbrella', x: 18, y: 280, z: 6 }, { label: 'Hooli', x: 35, y: 450, z: 12 }, { label: 'Stark', x: 52, y: 760, z: 30 },
  ] },
]
</script>
<template>
  <OScatterChart :series="series" :axis-labels="{ x: 'Seats', y: 'MRR' }" :format-y="(v) => `$${v}`">
    <template #tooltip="{ item }">
      <div class="w-40">
        <div class="flex items-center gap-1.5 text-xs text-ousi-muted">
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: item.color }" />{{ item.series }}
        </div>
        <div class="mt-0.5 text-base font-semibold text-ousi-foreground">{{ item.point.label }}</div>
        <div class="mt-1 text-xs tabular-nums text-ousi-muted">
          {{ item.formattedX }} seats · {{ item.formattedY }} MRR · {{ item.point.z }} users
        </div>
      </div>
    </template>
  </OScatterChart>
</template>
