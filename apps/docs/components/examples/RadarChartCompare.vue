<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, ORadarChart } from '@ousi-ui/vue'

const data = [
  { label: 'Speed', ana: 82, leo: 60 }, { label: 'Power', ana: 64, leo: 78 }, { label: 'Range', ana: 91, leo: 55 },
  { label: 'Agility', ana: 58, leo: 84 }, { label: 'Defense', ana: 73, leo: 66 }, { label: 'Stamina', ana: 86, leo: 70 },
]
const all = [
  { key: 'ana', label: 'Ana', color: 'accent' },
  { key: 'leo', label: 'Leo', color: 'orange' },
]
// Click a legend chip to hide or show a series
const hidden = ref<string[]>([])
const series = computed(() => all.filter((s) => !hidden.value.includes(s.key)))
const focused = ref<number | null>(null)
const toggle = (k: string) => { hidden.value = hidden.value.includes(k) ? hidden.value.filter((x) => x !== k) : [...hidden.value, k] }
const avg = (k: 'ana' | 'leo') => Math.round(data.reduce((s, r) => s + r[k], 0) / data.length)
</script>
<template>
  <OCard class="w-full max-w-md items-center gap-4 p-5">
    <div class="flex w-full flex-wrap items-center justify-between gap-2">
      <span class="text-sm font-medium text-ousi-muted">{{ focused == null ? 'Skills' : data[focused].label }}</span>
      <div class="flex gap-2">
        <button
          v-for="s in all" :key="s.key" type="button"
          class="flex items-center gap-1.5 rounded-full bg-ousi-default px-2.5 py-1 text-xs font-medium transition-opacity"
          :class="hidden.includes(s.key) && 'opacity-40'"
          @click="toggle(s.key)"
        >
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: `var(--ousi-${s.color})` }" />{{ s.label }}
        </button>
      </div>
    </div>
    <ORadarChart v-model:focused="focused" :data="data" :series="series" variant="dots" :max="100" :size="210" />
    <div class="grid w-full grid-cols-3 gap-2">
      <div
        v-for="(r, i) in data" :key="r.label"
        class="rounded-xl bg-ousi-default px-3 py-2 text-xs transition-opacity"
        :class="focused != null && focused !== i && 'opacity-40'"
        @mouseenter="focused = i" @mouseleave="focused = null"
      >
        <div class="text-ousi-muted">{{ r.label }}</div>
        <div class="mt-0.5 flex gap-2 font-semibold tabular-nums text-ousi-foreground">
          <span v-if="!hidden.includes('ana')" :style="{ color: 'var(--ousi-accent)' }">{{ r.ana }}</span>
          <span v-if="!hidden.includes('leo')" :style="{ color: 'var(--ousi-orange)' }">{{ r.leo }}</span>
        </div>
      </div>
    </div>
    <div class="flex w-full justify-between text-xs text-ousi-muted">
      <span>Ana avg <b class="tabular-nums text-ousi-foreground">{{ avg('ana') }}</b></span>
      <span>Leo avg <b class="tabular-nums text-ousi-foreground">{{ avg('leo') }}</b></span>
    </div>
  </OCard>
</template>
