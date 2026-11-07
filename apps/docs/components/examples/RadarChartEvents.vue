<script setup lang="ts">
import { ref } from 'vue'
import { ORadarChart } from '@ousi-ui/vue'
import type { RadarAxisItem } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', v: 82 }, { label: 'Power', v: 64 }, { label: 'Range', v: 91 },
  { label: 'Agility', v: 58 }, { label: 'Defense', v: 73 },
]
const picked = ref<RadarAxisItem | null>(null)
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <ORadarChart :data="data" :series="[{ key: 'v', label: 'Score', color: 'success' }]" variant="dots" :max="100" :size="190" @axis-click="(a) => (picked = a)" />
    <div class="rounded-xl bg-ousi-default px-4 py-3 text-xs">
      <div class="text-ousi-muted">Click an axis</div>
      <div v-if="picked" class="mt-1 text-base font-semibold text-ousi-foreground">{{ picked.label }} · {{ picked.values[0].formatted }}</div>
    </div>
  </div>
</template>
