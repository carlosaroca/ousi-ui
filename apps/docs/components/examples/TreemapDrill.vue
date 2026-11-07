<script setup lang="ts">
import { computed, ref } from 'vue'
import { OTreemap } from '@ousi-ui/vue'

// Click a tile to drill into its children; the breadcrumb takes you back.
interface Node { name: string; value?: number; color?: string; children?: Node[] }
const root: Node[] = [
  { name: 'Europe', color: '#4f8ff7', children: [{ name: 'Spain', value: 820 }, { name: 'France', value: 640 }, { name: 'Germany', value: 910 }, { name: 'Italy', value: 480 }] },
  { name: 'Americas', color: '#aee637', children: [{ name: 'Mexico', value: 760 }, { name: 'Brazil', value: 980 }, { name: 'Colombia', value: 420 }, { name: 'Chile', value: 260 }] },
  { name: 'Asia', color: '#b57bff', children: [{ name: 'Japan', value: 700 }, { name: 'India', value: 1100 }, { name: 'Korea', value: 380 }] },
  { name: 'Africa', color: '#f2b93b', children: [{ name: 'Kenya', value: 150 }, { name: 'Nigeria', value: 320 }] },
]
const path = ref<string[]>([])
const current = computed(() => {
  if (!path.value.length) return root
  const group = root.find((n) => n.name === path.value[0])!
  return (group.children ?? []).map((c) => ({ ...c, color: group.color }))
})
</script>
<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-1.5 text-sm">
      <button type="button" class="font-medium" :class="path.length ? 'text-ousi-muted hover:text-ousi-foreground' : 'text-ousi-foreground'" @click="path = []">All regions</button>
      <template v-if="path.length"><span class="text-ousi-muted">/</span><span class="font-medium text-ousi-foreground">{{ path[0] }}</span></template>
    </div>
    <OTreemap
      :data="current"
      :height="300"
      @node-click="(n) => { if (!path.length) path = [n.name] }"
    />
    <p class="text-xs text-ousi-muted">{{ path.length ? 'Click “All regions” to go back.' : 'Click a region to see its countries.' }}</p>
  </div>
</template>
