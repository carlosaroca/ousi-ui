<script setup lang="ts">
import { OAreaChart } from '@ousi-ui/vue'

const data = [
  { d: 'Mon', web: 420, ios: 260, android: 180 }, { d: 'Tue', web: 510, ios: 300, android: 210 },
  { d: 'Wed', web: 480, ios: 340, android: 260 }, { d: 'Thu', web: 620, ios: 380, android: 240 },
  { d: 'Fri', web: 700, ios: 410, android: 300 }, { d: 'Sat', web: 540, ios: 460, android: 350 },
  { d: 'Sun', web: 460, ios: 420, android: 330 },
]
</script>
<template>
  <OAreaChart
    :data="data"
    category-key="d"
    curve="linear"
    show-points
    :series="[
      { key: 'web', label: 'Web', color: 'accent' },
      { key: 'ios', label: 'iOS', color: 'violet' },
      { key: 'android', label: 'Android', color: 'success' },
    ]"
  />
</template>
