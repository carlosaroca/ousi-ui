<script setup lang="ts">
import { ref } from 'vue'
import { OActivityRings } from '@ousi-ui/vue'

const focused = ref<string | null>(null)
const rings = [
  { label: 'Move', value: 1592, max: 2000, color: 'danger', valueLabel: '1,592 kcal' },
  { label: 'Exercise', value: 105, max: 120, color: 'success', valueLabel: '1h 45m' },
  { label: 'Running', value: 5.2, max: 8, color: 'accent', valueLabel: '5.2 km' },
]
</script>
<template>
  <OActivityRings v-model:focused="focused" :rings="rings" show-stats />
</template>
