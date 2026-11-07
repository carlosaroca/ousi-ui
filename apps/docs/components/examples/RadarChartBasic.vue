<script setup lang="ts">
import { ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', you: 82 }, { label: 'Power', you: 64 }, { label: 'Range', you: 91 },
  { label: 'Agility', you: 58 }, { label: 'Defense', you: 73 }, { label: 'Stamina', you: 86 },
]
</script>
<template>
  <ORadarChart :data="data" :series="[{ key: 'you', label: 'You' }]" :max="100" />
</template>
