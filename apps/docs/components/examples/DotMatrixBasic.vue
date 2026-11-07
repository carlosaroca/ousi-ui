<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

// Each column fills from the bottom: 5 dots, so a value of 60 of 100 lights 3 dots.
const rand = (s: number) => { const x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 24 }, (_, i) => ({
  label: `Day ${i + 1}`,
  value: Math.round(8 + rand(i + 3) * 92),
}))
</script>
<template>
  <ODotMatrix :data="data" :max="100" color="violet" :dot-size="18" />
</template>
