<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODropdown, ODropdownItem, ODropdownMenu, ODropdownPopover, ODropdownTrigger, OFunnel } from '@ousi-ui/vue'

const colors = ['#aee637', '#4f8ff7', '#b57bff', '#ec6fb5']
const labels = ['Call opened', 'Started', 'Completed', 'Converted']
const ranges = [
  { key: '7d', label: 'Last 7 days', values: [197, 110, 77, 38], delta: 5.2 },
  { key: '30d', label: 'Last 30 days', values: [812, 470, 301, 164], delta: 8.9 },
  { key: '90d', label: 'Last 90 days', values: [2390, 1304, 880, 452], delta: -2.1 },
]
const range = ref(ranges[0])
const focused = ref<number | null>(null)

const stages = computed(() => range.value.values.map((value, i) => ({ label: labels[i], value, color: colors[i] })))
const active = computed(() => (focused.value == null ? null : stages.value[focused.value]))
</script>
<template>
  <!-- The header is plain markup: a title, the number that follows the hovered stage, a delta chip and a period dropdown -->
  <OCard class="w-full max-w-2xl gap-4 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Sign-up funnel' }}</div>
        <div class="mt-1 flex items-center gap-3">
          <OAnimatedNumber :value="active ? active.value : stages[0].value" animation="count" :duration="300" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
          <span
            class="rounded-lg px-2 py-0.5 text-sm font-medium tabular-nums"
            :class="range.delta >= 0 ? 'bg-ousi-success/20 text-ousi-success-soft-strong' : 'bg-ousi-danger/15 text-ousi-danger-soft-strong'"
          >
            {{ range.delta >= 0 ? '+' : '' }}{{ range.delta }}%
          </span>
        </div>
      </div>
      <ODropdown>
        <ODropdownTrigger>
          <button type="button" class="flex items-center gap-2 rounded-xl bg-ousi-background px-3 py-2 text-sm font-medium text-ousi-foreground shadow-sm">
            <svg viewBox="0 0 24 24" class="size-4 text-ousi-muted" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
            {{ range.label }}
            <svg viewBox="0 0 12 12" class="size-3 text-ousi-muted" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5 6 7.5 9 4.5" /></svg>
          </button>
        </ODropdownTrigger>
        <ODropdownPopover placement="bottom-end">
          <ODropdownMenu @action="(k) => (range = ranges.find((r) => r.key === k)!)">
            <ODropdownItem v-for="r in ranges" :id="r.key" :key="r.key">{{ r.label }}</ODropdownItem>
          </ODropdownMenu>
        </ODropdownPopover>
      </ODropdown>
    </div>
    <OFunnel v-model:focused="focused" :key="range.key" :stages="stages" :height="230" />
  </OCard>
</template>
