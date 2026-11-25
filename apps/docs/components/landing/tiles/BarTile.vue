<script setup lang="ts">
import { computed } from 'vue'
import { OBarChart } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const presets = [
  { web: [42, 51, 47, 63, 58, 36, 29], app: [28, 34, 41, 52, 44, 30, 22] },
  { web: [55, 38, 62, 49, 71, 44, 33], app: [36, 45, 30, 58, 39, 51, 27] },
  { web: [33, 60, 44, 72, 50, 62, 41], app: [47, 29, 53, 35, 61, 28, 38] },
]

const preset = slot(3.6)
const sweep = slot(0.9)

const data = computed(() => {
  const p = presets[preset.value % presets.length]
  return days.map((day, i) => ({ day, web: p.web[i], app: p.app[i] }))
})
// The last step of the sweep is "nothing hovered", so the ring also disappears now and then.
const focused = computed(() => {
  const i = sweep.value % (days.length + 1)
  return i === days.length ? null : i
})
</script>

<template>
  <ShowcaseTile tone="light" title="Bar chart" is-new>
    <OBarChart
      :data="data"
      category-key="day"
      :series="[
        { key: 'web', label: 'Web', color: 'accent' },
        { key: 'app', label: 'App', color: 'violet' },
      ]"
      :height="150"
      :bar-radius="6"
      :bar-gap="0.35"
      :max="80"
      :focused="focused"
      outline
      dim
      animated
    />
  </ShowcaseTile>
</template>
