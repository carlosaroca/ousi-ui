<script setup lang="ts">
import { computed } from 'vue'
import { ORadarChart } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const axes = ['Design', 'Speed', 'Tests', 'Docs', 'A11y', 'Types']
const presets = [
  { now: [82, 64, 91, 58, 73, 86], before: [60, 72, 55, 80, 64, 70] },
  { now: [64, 88, 70, 82, 90, 60], before: [75, 58, 80, 62, 70, 84] },
  { now: [90, 70, 62, 76, 58, 92], before: [66, 84, 72, 56, 82, 64] },
]

const preset = slot(3.4)
const sweep = slot(1.1)

const data = computed(() => {
  const p = presets[preset.value % presets.length]
  return axes.map((label, i) => ({ label, now: p.now[i], before: p.before[i] }))
})
// Walks the highlight around the axes, like a pointer hovering each one in turn.
const focused = computed(() => sweep.value % axes.length)
</script>

<template>
  <ShowcaseTile title="Radar chart" is-new badge="chip" badge-color="violet">
    <ORadarChart
      class="mx-auto"
      :data="data"
      :series="[
        { key: 'now', label: 'Now', color: 'accent' },
        { key: 'before', label: 'Before', color: 'violet' },
      ]"
      variant="dots"
      :max="100"
      :size="128"
      :focused="focused"
      animated
    />
  </ShowcaseTile>
</template>
