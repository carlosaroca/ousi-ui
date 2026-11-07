<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OScatterChart } from '@ousi-ui/vue'

const rand = (seed: number) => { const x = Math.sin(seed * 91.7) * 43758.5453; return x - Math.floor(x) }
const make = (seed: number, slope: number, base: number) =>
  Array.from({ length: 14 }, (_, i) => ({
    label: `Account ${seed * 20 + i}`,
    x: Math.round(2 + i * 1.6 + rand(seed + i) * 3),
    y: Math.round(base + i * slope + rand(seed * 3 + i) * 18),
    z: Math.round(10 + rand(seed * 5 + i) * 90),
  }))
const all = [
  { label: 'Starter', color: 'accent', points: make(1, 2.2, 8) },
  { label: 'Team', color: 'violet', points: make(2, 3.4, 20) },
  { label: 'Enterprise', color: 'orange', points: make(3, 5.1, 34) },
]
const hidden = ref<string[]>([])
const series = computed(() => all.filter((s) => !hidden.value.includes(s.label)))
const toggle = (l: string) => { hidden.value = hidden.value.includes(l) ? hidden.value.filter((x) => x !== l) : [...hidden.value, l] }
const count = computed(() => series.value.reduce((s, x) => s + x.points.length, 0))
</script>
<template>
  <OCard class="w-full max-w-2xl gap-4 p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">Usage vs revenue</div>
        <div class="text-xs tabular-nums text-ousi-muted"><b class="text-ousi-foreground">{{ count }}</b> accounts · bubble = seats</div>
      </div>
      <div class="flex gap-2">
        <button
          v-for="s in all" :key="s.label" type="button"
          class="flex items-center gap-1.5 rounded-full bg-ousi-default px-2.5 py-1 text-xs font-medium transition-opacity"
          :class="hidden.includes(s.label) && 'opacity-40'"
          @click="toggle(s.label)"
        >
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: `var(--ousi-${s.color})` }" />{{ s.label }}
        </button>
      </div>
    </div>
    <OScatterChart :series="series" :height="300" :radius="[4, 16]" :axis-labels="{ x: 'Sessions per week', y: 'MRR ($)' }" :format-y="(v) => `$${v}`">
      <template #tooltip="{ item }">
        <div class="w-44">
          <div class="flex items-center gap-1.5 text-[11px] text-ousi-muted">
            <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: item.color }" />{{ item.series }}
          </div>
          <div class="text-sm font-semibold text-ousi-foreground">{{ item.point.label }}</div>
          <div class="mt-1 grid grid-cols-3 gap-1 text-center text-[11px]">
            <div class="rounded-lg bg-ousi-default py-1"><div class="font-semibold tabular-nums text-ousi-foreground">{{ item.formattedX }}</div>sessions</div>
            <div class="rounded-lg bg-ousi-default py-1"><div class="font-semibold tabular-nums text-ousi-foreground">{{ item.formattedY }}</div>MRR</div>
            <div class="rounded-lg bg-ousi-default py-1"><div class="font-semibold tabular-nums text-ousi-foreground">{{ item.point.z }}</div>seats</div>
          </div>
        </div>
      </template>
    </OScatterChart>
  </OCard>
</template>
