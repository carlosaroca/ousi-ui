<script setup lang="ts">
import { OTreemap } from '@ousi-ui/vue'

const data = [
  { name: 'Subscriptions', value: 5200, color: '#4f8ff7' }, { name: 'Services', value: 2600, color: '#b57bff' },
  { name: 'Hardware', value: 1900, color: '#f08a3c' }, { name: 'Licensing', value: 1300, color: '#aee637' },
  { name: 'Training', value: 800, color: '#ec6fb5' }, { name: 'Other', value: 420, color: '#9ca3af' },
]
</script>
<template>
  <!-- `label` replaces the content of every tile; `tooltip` replaces the floating card -->
  <OTreemap :data="data" :height="300" :show-labels="false">
    <template #label="{ item, focused }">
      <div v-if="item.w > 90 && item.h > 60" class="flex h-full flex-col justify-between p-3 text-white">
        <div class="flex items-center justify-between text-xs font-medium">
          <span class="truncate">{{ item.name }}</span>
          <span class="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] tabular-nums">{{ item.percent }}%</span>
        </div>
        <div class="text-xl font-semibold tabular-nums" :class="focused && 'underline decoration-white/60 underline-offset-4'">${{ (item.value / 1000).toFixed(1) }}k</div>
      </div>
    </template>
    <template #tooltip="{ item }">
      <div class="w-36">
        <div class="font-semibold text-ousi-foreground">{{ item.name }}</div>
        <div class="text-ousi-muted">{{ item.percent }}% of revenue</div>
        <div class="mt-1 text-sm font-semibold tabular-nums text-ousi-foreground">${{ item.value.toLocaleString() }}</div>
      </div>
    </template>
  </OTreemap>
</template>
