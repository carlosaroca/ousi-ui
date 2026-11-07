<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

// `scale` shrinks a whole column: handy for an unfinished period or a forecast.
const rand = (s: number) => { const x = Math.sin(s * 78.233) * 43758.5453; return x - Math.floor(x) }
const N = 26
const data = Array.from({ length: N }, (_, i) => ({
  label: `Week ${i + 1}`,
  value: Math.round(30 + rand(i + 9) * 70),
  scale: i < N - 8 ? 1 : Math.max(0, 1 - (i - (N - 9)) * 0.14),
}))
</script>
<template>
  <ODotMatrix :data="data" :max="100" color="#f2b93b" :dot-size="18" partial />
</template>
