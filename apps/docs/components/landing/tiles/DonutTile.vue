<script setup lang="ts">
import { computed } from 'vue'
import { OAnimatedNumber, ODonutChart } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const sources = [
  { label: 'Direct', color: 'accent' },
  { label: 'Search', color: 'violet' },
  { label: 'Social', color: 'orange' },
  { label: 'Email', color: 'success' },
]
const presets = [[4200, 3100, 1800, 900], [3300, 4400, 1200, 1500], [2600, 2900, 3600, 800]]

const preset = slot(3.8)
const sweep = slot(1.3)

const data = computed(() => {
  const values = presets[preset.value % presets.length]
  return sources.map((s, i) => ({ ...s, value: values[i] }))
})
const focused = computed(() => sweep.value % sources.length)
const total = computed(() => data.value.reduce((sum, d) => sum + d.value, 0))
</script>

<template>
  <ShowcaseTile title="Donut chart" is-new badge="chip" badge-color="success">
    <div class="flex items-center gap-3">
      <ODonutChart :data="data" :size="116" :thickness="17" :gap="4" rounded :focused="focused" animated class="shrink-0">
        <template #default="{ focusedItem }">
          <div class="text-center">
            <div class="flex items-baseline justify-center text-lg font-semibold tabular-nums text-ousi-foreground">
              <OAnimatedNumber :value="focusedItem ? focusedItem.percent : 100" animation="count" :duration="300" :format-options="{ maximumFractionDigits: 0 }" />
              <span class="text-xs text-ousi-muted">%</span>
            </div>
            <div class="text-[10px] text-ousi-muted">{{ focusedItem ? focusedItem.label : 'All' }}</div>
          </div>
        </template>
      </ODonutChart>
      <ul class="flex min-w-0 flex-1 flex-col gap-1.5">
        <li
          v-for="(d, i) in data"
          :key="d.label"
          class="flex items-center gap-2 text-[11px] transition-opacity duration-300"
          :class="focused === i ? 'opacity-100' : 'opacity-50'"
        >
          <span class="size-2 shrink-0 rounded-full" :style="{ background: `var(--ousi-${d.color})` }" />
          <span class="flex-1 truncate text-ousi-foreground">{{ d.label }}</span>
          <span class="tabular-nums text-ousi-muted">{{ Math.round((d.value / total) * 100) }}%</span>
        </li>
      </ul>
    </div>
  </ShowcaseTile>
</template>
