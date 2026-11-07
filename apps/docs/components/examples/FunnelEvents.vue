<script setup lang="ts">
import { ref } from 'vue'
import { OFunnel } from '@ousi-ui/vue'
import type { FunnelItem } from '@ousi-ui/vue'

const stages = [
  { label: 'Leads', value: 1240 },
  { label: 'Qualified', value: 860 },
  { label: 'Proposal', value: 410 },
  { label: 'Won', value: 96 },
]
const log = ref<string[]>([])
const selected = ref<FunnelItem | null>(null)
const push = (m: string) => { log.value = [m, ...log.value].slice(0, 4) }
</script>
<template>
  <div class="flex flex-col gap-5">
    <OFunnel
      :stages="stages"
      variant="bars"
      @stage-enter="(s) => push(`enter · ${s.label}`)"
      @stage-leave="(s) => push(`leave · ${s.label}`)"
      @stage-click="(s) => { selected = s; push(`click · ${s.label}`) }"
    />
    <div class="flex flex-wrap items-start justify-between gap-4 text-xs">
      <ul class="min-h-16 space-y-1 font-mono text-ousi-muted">
        <li v-if="!log.length">Hover or click a stage…</li>
        <li v-for="(l, i) in log" :key="`${i}-${l}`" :class="i === 0 && 'text-ousi-foreground'">{{ l }}</li>
      </ul>
      <div v-if="selected" class="rounded-xl bg-ousi-default px-4 py-3">
        <div class="text-ousi-muted">Selected</div>
        <div class="text-base font-semibold text-ousi-foreground">{{ selected.label }}</div>
        <div class="tabular-nums text-ousi-muted">{{ selected.formatted }} · {{ selected.percent }}% of top</div>
      </div>
    </div>
  </div>
</template>
