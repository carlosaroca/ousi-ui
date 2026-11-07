<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OTreemap } from '@ousi-ui/vue'
import type { TreemapItem } from '@ousi-ui/vue'

const sets = {
  Today: [
    { name: 'Apple', value: 3200, color: '#4f8ff7' }, { name: 'Microsoft', value: 2900, color: '#b57bff' },
    { name: 'NVIDIA', value: 2600, color: '#aee637' }, { name: 'Amazon', value: 1900, color: '#f2b93b' },
    { name: 'Alphabet', value: 1700, color: '#ec6fb5' }, { name: 'Meta', value: 1100, color: '#38b2d8' },
    { name: 'Tesla', value: 800, color: '#f08a3c' }, { name: 'Others', value: 640, color: '#9ca3af' },
  ],
  'This year': [
    { name: 'NVIDIA', value: 4800, color: '#aee637' }, { name: 'Apple', value: 3000, color: '#4f8ff7' },
    { name: 'Microsoft', value: 2500, color: '#b57bff' }, { name: 'Alphabet', value: 1600, color: '#ec6fb5' },
    { name: 'Amazon', value: 1500, color: '#f2b93b' }, { name: 'Meta', value: 1400, color: '#38b2d8' },
    { name: 'Tesla', value: 500, color: '#f08a3c' }, { name: 'Others', value: 520, color: '#9ca3af' },
  ],
} as const
type Range = keyof typeof sets

const range = ref<Range>('Today')
const hovered = ref<TreemapItem | null>(null)
const total = computed(() => sets[range.value].reduce((s, d) => s + d.value, 0))
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-3xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ hovered ? `${hovered.name} · ${hovered.percent}% of portfolio` : 'Portfolio' }}</div>
        <OAnimatedNumber locale="en-US" :value="hovered ? hovered.value : total" :format-options="usd" animation="count" :duration="300" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="(_, r) in sets" :key="r" type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="range === r ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="range = r as Range"
        >{{ r }}</button>
      </div>
    </div>
    <!-- Tiles move to their new position when the data changes -->
    <OTreemap :data="[...sets[range]]" :height="320" :tooltip="false" @node-enter="(n) => (hovered = n)" @node-leave="hovered = null" />
  </OCard>
</template>
