<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

const rand = (s: number) => { const x = Math.sin(s * 23.17) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 20 }, (_, i) => ({ label: `Sprint ${i + 1}`, value: Math.round(20 + rand(i + 2) * 80) }))
</script>
<template>
  <ODotMatrix :data="data" :max="100" color="success" :dot-size="16">
    <template #tooltip="{ item }">
      <div class="w-36">
        <div class="text-[11px] uppercase tracking-wide text-ousi-muted">{{ item.label }}</div>
        <div class="mt-0.5 text-lg font-semibold tabular-nums text-ousi-foreground">{{ item.percent }}%</div>
        <div class="text-xs text-ousi-muted">of the goal · {{ item.filled }}/5 dots</div>
        <div class="mt-1 text-xs font-medium" :style="{ color: item.percent >= 70 ? 'var(--ousi-success)' : 'var(--ousi-warning)' }">
          {{ item.percent >= 70 ? 'On track' : 'Behind' }}
        </div>
      </div>
    </template>
  </ODotMatrix>
</template>
