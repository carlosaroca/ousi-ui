<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

const rand = (s: number) => { const x = Math.sin(s * 91.7) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 16 }, (_, i) => ({ label: `#${i + 1}`, value: Math.round(10 + rand(i + 1) * 90) }))
</script>
<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div><p class="mb-2 text-xs text-ousi-muted">circle (default)</p><ODotMatrix :data="data" :max="100" color="accent" :dot-size="14" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">rounded</p><ODotMatrix :data="data" :max="100" color="success" shape="rounded" :dot-size="14" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">square, 8 rows, tight gap</p><ODotMatrix :data="data" :max="100" color="orange" shape="square" :rows="8" :gap="3" :dot-size="12" /></div>
    <div><p class="mb-2 text-xs text-ousi-muted">3 rows, partial dots, strong empty color</p><ODotMatrix :data="data" :max="100" color="danger" :rows="3" partial empty-color="color-mix(in srgb, var(--ousi-foreground) 14%, transparent)" :dot-size="18" /></div>
  </div>
</template>
