<script setup lang="ts">
import { computed } from 'vue'
import { OAnimatedNumber, OChip, OTabs } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const items = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
]
const step = slot(2.6)
const yearly = computed(() => step.value % 2 === 1)
</script>

<template>
  <ShowcaseTile>
    <OTabs :model-value="yearly ? 'yearly' : 'monthly'" :items="items" size="sm" full-width />
    <div class="mt-5 flex items-end justify-between gap-2">
      <div class="flex items-baseline gap-1">
        <OAnimatedNumber :value="yearly ? 39 : 49" animation="roll" :duration="500" prefix="$" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
        <span class="text-[11px] text-ousi-muted">/ month</span>
      </div>
      <OChip size="sm" color="accent" variant="solid" class="transition-opacity duration-300" :class="yearly ? 'opacity-100' : 'opacity-0'">Save 20%</OChip>
    </div>
  </ShowcaseTile>
</template>
