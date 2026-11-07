<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 520, max: 600, color: 'danger' },
  { label: 'Exercise', value: 24, max: 30, color: 'success' },
  { label: 'Stand', value: 7, max: 12, color: 'accent' },
]
</script>
<template>
  <OActivityRings :rings="rings" />
</template>
