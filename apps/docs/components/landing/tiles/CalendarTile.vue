<script setup lang="ts">
import { computed } from 'vue'
import { OCalendar } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

// The selection hops around the month, one pick every 1.3 s.
const picks = [12, 18, 9, 24, 15, 6, 21, 11]
const day = computed(() => picks[slot(1.3).value % picks.length])
const value = computed(() => ({ year: 2026, month: 11, day: day.value }))
</script>

<template>
  <ShowcaseTile tone="dark" class="!p-3.5">
    <!-- The calendar needs about 275px. In a narrower column it shrinks to fit instead of overflowing. -->
    <div class="@container">
      <OCalendar :model-value="value" :indicator-days="[3, 9, 17, 24]" class="w-full @max-[17.2rem]:[zoom:0.92] @max-[15.9rem]:[zoom:0.84]" />
    </div>
  </ShowcaseTile>
</template>
