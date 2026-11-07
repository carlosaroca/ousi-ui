<script setup lang="ts">
import { OScatterChart } from '@ousi-ui/vue'

// Any point with a `z` turns the chart into a bubble chart.
const series = [
  { label: 'Europe', color: 'accent', points: [
    { label: 'Spain', x: 48, y: 7.2, z: 47 }, { label: 'France', x: 68, y: 6.1, z: 68 },
    { label: 'Germany', x: 84, y: 5.4, z: 84 }, { label: 'Italy', x: 59, y: 6.8, z: 59 },
  ] },
  { label: 'Americas', color: 'success', points: [
    { label: 'Brazil', x: 214, y: 9.4, z: 214 }, { label: 'Mexico', x: 128, y: 8.1, z: 128 },
    { label: 'Chile', x: 19, y: 7.7, z: 19 },
  ] },
  { label: 'Asia', color: 'violet', points: [
    { label: 'Japan', x: 125, y: 4.2, z: 125 }, { label: 'India', x: 380, y: 11.3, z: 380 },
    { label: 'Korea', x: 52, y: 5.0, z: 52 },
  ] },
]
</script>
<template>
  <OScatterChart
    :series="series"
    :height="340"
    :radius="[6, 26]"
    :axis-labels="{ x: 'Users (millions)', y: 'Growth (%)' }"
    :format-y="(v) => `${v}%`"
  />
</template>
