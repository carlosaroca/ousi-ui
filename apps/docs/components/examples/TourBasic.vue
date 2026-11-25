<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OCard, OInput, OTour } from '@ousi-ui/vue'
import type { TourStep } from '@ousi-ui/vue'

const open = ref(false)
const steps: TourStep[] = [
  { target: '#tour-search', title: 'Find anything', description: 'Search orders by number, client or city.' },
  { target: '#tour-new', title: 'Create an order', description: 'A new one starts here.', placement: 'left' },
  { target: '#tour-totals', title: 'Your day at a glance', description: 'These figures update as orders arrive.', placement: 'top' },
  // With no target, the step shows in the middle of the screen.
  { title: 'That is all', description: 'You can run this tour again whenever you like.' },
]
</script>
<template>
  <div class="flex w-full min-w-0 max-w-xl flex-col gap-4">
    <OCard class="min-w-0 gap-4 p-4 sm:p-5">
      <div class="flex items-center gap-3">
        <div id="tour-search" class="min-w-0 flex-1"><OInput placeholder="Search orders…" aria-label="Search orders" /></div>
        <OButton id="tour-new" size="sm">New order</OButton>
      </div>
      <div id="tour-totals" class="grid grid-cols-3 gap-3 text-center">
        <div v-for="[label, value] in [['Open', '24'], ['Sent', '118'], ['Late', '3']]" :key="label" class="rounded-ousi-xl bg-ousi-default py-3">
          <div class="text-xl font-semibold tabular-nums text-ousi-foreground">{{ value }}</div>
          <div class="text-xs text-ousi-muted">{{ label }}</div>
        </div>
      </div>
    </OCard>
    <OButton variant="outline" class="self-center" @click="open = true">Start the tour</OButton>
    <OTour v-model="open" :steps="steps" />
  </div>
</template>
