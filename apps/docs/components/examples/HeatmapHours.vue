<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODropdown, ODropdownItem, ODropdownMenu, ODropdownPopover, ODropdownTrigger, OHeatmap } from '@ousi-ui/vue'
import type { HeatmapFocus } from '@ousi-ui/vue'

const rand = (seed: number) => { const x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x) }
const hours = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ranges = [
  { key: 'week', label: 'This week', scale: 1 },
  { key: 'month', label: 'This month', scale: 4 },
  { key: 'quarter', label: 'This quarter', scale: 12 },
]
const range = ref(ranges[0])
const focused = ref<HeatmapFocus | null>(null)

const rows = computed(() =>
  days.map((label, d) => ({
    label,
    values: hours.map((_, h) => {
      const peak = Math.exp(-Math.pow(h - (d < 5 ? 3.5 : 5), 2) / 5)
      return Math.round((20 + rand(d * 10 + h + range.value.scale) * 40) * peak * range.value.scale)
    }),
  })),
)
const total = computed(() => rows.value.reduce((s, r) => s + r.values.reduce((a, b) => a + b, 0), 0))
const active = computed(() => (focused.value ? rows.value[focused.value.row].values[focused.value.col] : null))
</script>
<template>
  <OCard class="w-full max-w-lg gap-4 p-5">
    <div class="flex items-start justify-between">
      <div>
        <div class="text-sm font-medium text-ousi-muted">
          {{ focused ? `${days[focused.row]} · ${hours[focused.col]}` : 'Active users' }}
        </div>
        <OAnimatedNumber :value="active ?? total" animation="count" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
      </div>
      <ODropdown>
        <ODropdownTrigger>
          <button type="button" class="rounded-full bg-ousi-default px-3 py-1 text-xs font-medium text-ousi-foreground">{{ range.label }} ▾</button>
        </ODropdownTrigger>
        <ODropdownPopover placement="bottom-end">
          <ODropdownMenu @action="(k) => (range = ranges.find((r) => r.key === k)!)">
            <ODropdownItem v-for="r in ranges" :id="r.key" :key="r.key">{{ r.label }}</ODropdownItem>
          </ODropdownMenu>
        </ODropdownPopover>
      </ODropdown>
    </div>
    <OHeatmap v-model:focused="focused" :rows="rows" :columns="hours" color="success" :tooltip="false" show-legend />
  </OCard>
</template>
