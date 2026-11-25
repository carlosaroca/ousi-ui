<script setup lang="ts">
import { computed } from 'vue'
import { OAnimatedNumber, ORating } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const words = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent']
const step = slot(0.8)
// Climbs 1 to 5 and wraps, so the stars fill one by one.
const stars = computed(() => ((step.value + 4) % 5) + 1)
</script>

<template>
  <ShowcaseTile>
    <p class="text-xs font-medium text-ousi-muted">Rating</p>
    <div class="mt-2 flex items-baseline gap-1">
      <OAnimatedNumber :value="stars" animation="roll" :duration="350" :format-options="{ minimumFractionDigits: 1 }" locale="en-US" class="text-[38px] font-semibold leading-none tabular-nums text-ousi-foreground" />
      <span class="text-xs text-ousi-muted">/ 5</span>
    </div>
    <ORating :model-value="stars" read-only size="md" class="mt-3" />
    <p class="mt-2 text-[11px] text-ousi-muted">{{ words[stars - 1] }}</p>
  </ShowcaseTile>
</template>
