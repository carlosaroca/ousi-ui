<script setup lang="ts">
import { ref } from 'vue'
import { OComboChart } from '@ousi-ui/vue'
import type { ComboChartPoint } from '@ousi-ui/vue'

const data = [
  { month: 'Jan', sessions: 8200, conversion: 2.9 }, { month: 'Feb', sessions: 9100, conversion: 3.1 },
  { month: 'Mar', sessions: 8700, conversion: 3.0 }, { month: 'Apr', sessions: 10400, conversion: 3.6 },
  { month: 'May', sessions: 11800, conversion: 3.9 }, { month: 'Jun', sessions: 12600, conversion: 4.2 },
]

const log = ref<string[]>([])
const selected = ref<ComboChartPoint | null>(null)
const push = (m: string) => { log.value = [m, ...log.value].slice(0, 4) }
</script>
<template>
  <div class="flex flex-col gap-4">
    <OComboChart
      :data="data"
      category-key="month"
      :height="220"
      :tooltip="false"
      :bar="{ key: 'sessions', label: 'Sessions' }"
      :line="{ key: 'conversion', label: 'Conversion', format: (v) => `${v}%` }"
      @point-enter="(p) => push(`enter · ${p.category}`)"
      @point-leave="(p) => push(`leave · ${p.category}`)"
      @point-click="(p) => { selected = p; push(`click · ${p.category}`) }"
    />
    <div class="flex flex-wrap items-start justify-between gap-4 text-xs">
      <ul class="min-h-16 space-y-1 font-mono text-ousi-muted">
        <li v-if="!log.length">Hover or click a category…</li>
        <li v-for="(l, i) in log" :key="`${i}-${l}`" :class="i === 0 && 'text-ousi-foreground'">{{ l }}</li>
      </ul>
      <div v-if="selected" class="rounded-xl bg-ousi-default px-4 py-3">
        <div class="text-ousi-muted">Selected</div>
        <div class="text-base font-semibold text-ousi-foreground">{{ selected.category }}</div>
        <div class="tabular-nums text-ousi-muted">{{ selected.bar.formatted }} · {{ selected.line?.formatted }}</div>
      </div>
    </div>
  </div>
</template>
