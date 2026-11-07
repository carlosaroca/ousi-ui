<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODotMatrix } from '@ousi-ui/vue'

// KPI cards: hover a column and the value and the change switch to that day, animated.
const rand = (s: number) => { const x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x) }
const make = (seed: number, lo: number, hi: number, last: number, n = 16) =>
  Array.from({ length: n }, (_, i) => ({
    label: `Day ${i + 1}`,
    value: i === n - 1 ? last : Math.round(lo + rand(seed + i) * (hi - lo)),
  }))

const cards = [
  { label: 'Appointments today', color: '#38b2d8', icon: 'calendar', data: make(3, 18, 70, 48), delta: 8, percent: true, invert: false, prefix: '' },
  { label: 'Waiting now', color: '#f08a3c', icon: 'hourglass', data: make(17, 1, 12, 6), delta: -3, percent: false, invert: true, prefix: '' },
  { label: 'Unsigned notes', color: '#8b6cf0', icon: 'pen', data: make(29, 0, 9, 5), delta: 2, percent: false, invert: true, prefix: '' },
]

const focused = ref<(number | null)[]>(cards.map(() => null))

const view = computed(() =>
  cards.map((c, i) => {
    const h = focused.value[i]
    if (h == null) return { value: c.data[c.data.length - 1].value, delta: c.delta, day: '' }
    const prev = c.data[h - 1]?.value ?? c.data[h].value
    const diff = c.data[h].value - prev
    // Percent cards show the relative change; the others the difference in units
    const delta = c.percent ? (prev ? Math.round((diff / prev) * 100) : 0) : diff
    return { value: c.data[h].value, delta, day: c.data[h].label }
  }),
)
const good = (i: number) => (cards[i].invert ? view.value[i].delta <= 0 : view.value[i].delta >= 0)
const max = (i: number) => Math.max(...cards[i].data.map((d) => d.value), 1)
</script>
<template>
  <div class="grid gap-4 md:grid-cols-3">
    <OCard v-for="(c, i) in cards" :key="c.label" class="gap-3 p-4">
      <div class="flex items-center gap-3">
        <div class="grid size-8 shrink-0 place-items-center rounded-lg" :style="{ backgroundColor: `color-mix(in srgb, ${c.color} 14%, transparent)`, color: c.color }">
          <svg v-if="c.icon === 'calendar'" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
          <svg v-else-if="c.icon === 'hourglass'" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" /></svg>
          <svg v-else viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1zM14 7l3 3" /></svg>
        </div>
        <span class="min-w-0 truncate text-xs text-ousi-muted">{{ c.label }}</span>
        <span class="ml-auto shrink-0 text-[11px] tabular-nums text-ousi-muted">{{ view[i].day }}</span>
      </div>

      <div class="flex items-baseline justify-between">
        <OAnimatedNumber :value="view[i].value" animation="count" :duration="300" class="text-2xl font-semibold tabular-nums tracking-tight text-ousi-foreground" />
        <span class="flex items-center gap-1 text-xs font-medium tabular-nums" :class="good(i) ? 'text-ousi-success-soft-strong' : 'text-ousi-danger-soft-strong'">
          <svg viewBox="0 0 12 12" class="size-2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path v-if="view[i].delta >= 0" d="M3 9l6-6M4 3h5v5" /><path v-else d="M3 3l6 6M9 4v5H4" />
          </svg>
          <OAnimatedNumber
            :value="view[i].delta"
            :format-options="{ signDisplay: 'exceptZero', maximumFractionDigits: 0 }"
            :suffix="c.percent ? '%' : ''"
            animation="count"
            :duration="300"
          />
        </span>
      </div>

      <!-- Each card keeps its own focus: the column under the pointer drives the numbers above -->
      <ODotMatrix v-model:focused="focused[i]" :data="c.data" :max="max(i)" :color="c.color" :dot-size="14" :gap="5" align="start" :tooltip="false" />
    </OCard>
  </div>
</template>
