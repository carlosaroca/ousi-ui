<script setup lang="ts">
import { ref } from 'vue'
import { ODotMatrix } from '@ousi-ui/vue'
import type { DotMatrixItem } from '@ousi-ui/vue'

const rand = (s: number) => { const x = Math.sin(s * 61.3) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 18 }, (_, i) => ({ label: `Day ${i + 1}`, value: Math.round(10 + rand(i + 7) * 90) }))
const picked = ref<DotMatrixItem[]>([])
function toggle(it: DotMatrixItem) {
  picked.value = picked.value.some((p) => p.index === it.index) ? picked.value.filter((p) => p.index !== it.index) : [...picked.value, it]
}
const avg = () => (picked.value.length ? Math.round(picked.value.reduce((s, p) => s + p.value, 0) / picked.value.length) : 0)
</script>
<template>
  <div class="flex flex-col gap-4">
    <ODotMatrix :data="data" :max="100" color="accent" :dot-size="16" @column-click="toggle" />
    <p class="text-xs text-ousi-muted">
      Click columns to select them ·
      <b class="tabular-nums text-ousi-foreground">{{ picked.length }}</b> selected, average
      <b class="tabular-nums text-ousi-foreground">{{ avg() }}</b>
      <span v-if="picked.length"> · {{ picked.map((p) => p.label).join(', ') }}</span>
    </p>
  </div>
</template>
