<script setup lang="ts">
import { OScatterChart } from '@ousi-ui/vue'

const series = [
  { label: 'Free', color: 'accent', points: [
    { x: 2, y: 12 }, { x: 4, y: 18 }, { x: 5, y: 22 }, { x: 7, y: 25 }, { x: 8, y: 31 }, { x: 10, y: 34 },
  ] },
  { label: 'Pro', color: 'orange', points: [
    { x: 3, y: 38 }, { x: 5, y: 46 }, { x: 6, y: 52 }, { x: 8, y: 61 }, { x: 9, y: 66 }, { x: 11, y: 74 },
  ] },
]
</script>
<template>
  <OScatterChart :series="series" :axis-labels="{ x: 'Sessions per week', y: 'Revenue ($)' }" />
</template>
