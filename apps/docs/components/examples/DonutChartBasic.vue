<script setup lang="ts">
import { ODonutChart } from '@ousi-ui/vue'

const data = [
  { label: 'Direct', value: 4200, color: 'accent' },
  { label: 'Search', value: 3100, color: 'violet' },
  { label: 'Social', value: 1800, color: 'orange' },
  { label: 'Email', value: 900, color: 'success' },
]
</script>
<template>
  <ODonutChart :data="data" />
</template>
