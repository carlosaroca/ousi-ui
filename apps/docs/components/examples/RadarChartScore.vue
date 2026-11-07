<script setup lang="ts">
import { ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Sleep', v: 78 }, { label: 'Activity', v: 91 }, { label: 'Nutrition', v: 54 },
  { label: 'Focus', v: 83 }, { label: 'Mood', v: 70 }, { label: 'Recovery', v: 88 },
]
</script>
<template>
  <!-- Axes below alert-below turn red; the center shows the average, or the hovered axis. -->
  <ORadarChart :data="data" :series="[{ key: 'v', label: 'Score', color: 'violet' }]" variant="score" :max="100" :alert-below="60" :size="220" />
</template>
