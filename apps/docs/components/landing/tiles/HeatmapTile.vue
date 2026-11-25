<script setup lang="ts">
import { computed } from 'vue'
import { OHeatmap } from '@ousi-ui/vue'
import type { HeatmapFocus } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const WEEKS = 17
const rand = (seed: number) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x) }
const valueOf = (week: number, day: number) => {
  const r = rand(week * 7 + day + 1)
  return r < 0.3 ? 0 : Math.round(r * r * 14)
}

// The calendar slides one week every 1.6 s, as if time were passing.
const shift = slot(1.6)
const rows = computed(() =>
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, day) => ({
    label,
    values: Array.from({ length: WEEKS }, (_, w) => valueOf(w + shift.value, day)),
  })),
)
const columns = Array.from({ length: WEEKS }, () => '')

// A cell is highlighted now and then, walking across the grid.
const sweep = slot(0.7)
const focused = computed<HeatmapFocus>(() => ({ row: (sweep.value * 3) % 7, col: (sweep.value * 5) % WEEKS }))
</script>

<template>
  <ShowcaseTile title="Heatmap" is-new>
    <OHeatmap
      :rows="rows"
      :columns="columns"
      color="success"
      :levels="4"
      empty-color="color-mix(in srgb, var(--ousi-foreground) 8%, transparent)"
      square
      :gap="3"
      :cell-radius="3"
      :show-row-labels="false"
      :show-column-labels="false"
      :focused="focused"
      :tooltip="false"
      animated
    />
  </ShowcaseTile>
</template>
