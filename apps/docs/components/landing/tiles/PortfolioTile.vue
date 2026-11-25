<script setup lang="ts">
import { computed } from 'vue'
import { OAnimatedNumber, OAreaChart, OChart, OChip } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

// The series lives in the shared clock; here it is only drawn and scaled to a portfolio.
const { revenue, reduced } = useShowcase()
const { data, value } = revenue
const total = computed(() => (reduced.value ? 12935.05 : 12400 + (value.value - 100) * 30))

// OChart is a live chart: it scrolls with the clock on its own, which a visitor who asked for less
// motion should not get. They see a still area chart of the same kind of curve instead.
const still = Array.from({ length: 24 }, (_, i) => ({ day: i, value: 100 + i * 1.1 + Math.sin(i * 0.9) * 3.2 + Math.sin(i * 0.31) * 2 }))
</script>

<template>
  <ShowcaseTile tone="light">
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-ousi-muted">Portfolio</span>
      <OChip size="xs" color="accent" variant="soft">+2.4%</OChip>
    </div>
    <OAnimatedNumber
      :value="total"
      animation="roll"
      :duration="500"
      prefix="$"
      locale="en-US"
      :format-options="{ minimumFractionDigits: 2, maximumFractionDigits: 2 }"
      class="mt-1.5 text-[26px] font-semibold leading-none tracking-tight tabular-nums text-ousi-foreground"
    />
    <div class="-mx-1 mt-3 h-[150px]">
      <OAreaChart
        v-if="reduced"
        :data="still"
        category-key="day"
        :series="[{ key: 'value', label: 'Value', color: 'accent' }]"
        :height="150"
        :grid="false"
        :show-x-axis="false"
        :show-y-axis="false"
        :interactive="false"
        baseline="auto"
      />
      <OChart
        v-else
        :data="data"
        :value="value"
        theme="light"
        :grid="false"
        :badge="false"
        :momentum="false"
        :scrub="false"
        :padding="{ top: 8, right: 8, bottom: 4, left: 8 }"
        :format-value="(v: number) => `$${v.toFixed(2)}`"
      />
    </div>
  </ShowcaseTile>
</template>
