<script setup lang="ts">
import { ref } from 'vue'
import { OActivityRings } from '@ousi-ui/vue'
import type { ActivityRingItem } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 520, max: 600, color: 'danger' },
  { label: 'Exercise', value: 24, max: 30, color: 'success' },
  { label: 'Stand', value: 7, max: 12, color: 'accent' },
]

const log = ref<string[]>([])
const selected = ref<string | null>(null)

function push(message: string) {
  log.value = [message, ...log.value].slice(0, 5)
}
function onClick(ring: ActivityRingItem) {
  selected.value = selected.value === ring.key ? null : ring.key
  push(`click · ${ring.label} (${ring.percent}%)`)
}
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <OActivityRings
      :rings="rings"
      :size="170"
      @ring-enter="(r) => push(`enter · ${r.label}`)"
      @ring-leave="(r) => push(`leave · ${r.label}`)"
      @ring-click="onClick"
    />
    <ul class="min-h-24 w-52 space-y-1 font-mono text-xs text-ousi-muted">
      <li v-if="!log.length">Hover or click a ring…</li>
      <li v-for="(line, i) in log" :key="`${i}-${line}`" :class="i === 0 && 'text-ousi-foreground'">{{ line }}</li>
      <li v-if="selected" class="pt-1 text-ousi-accent">selected: {{ selected }}</li>
    </ul>
  </div>
</template>
