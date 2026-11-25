<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OSwitch, OTour } from '@ousi-ui/vue'
import type { TourStep } from '@ousi-ui/vue'

const open = ref(false)
const step = ref(0)
const alerts = ref(false)
const steps: TourStep[] = [
  // `interactive` leaves the highlighted part usable: here, the switch moves the tour on.
  { target: '#tour-alerts', title: 'Turn alerts on', description: 'Try it: flip the switch to continue.', interactive: true },
  { target: '#tour-alerts', title: 'Done', description: 'We will tell you when an order is late.' },
]

function onAlerts(on: boolean) {
  alerts.value = on
  if (open.value && step.value === 0 && on) step.value = 1
}
function start() {
  alerts.value = false
  step.value = 0
  open.value = true
}
</script>
<template>
  <div class="flex flex-col items-center gap-5">
    <div id="tour-alerts" class="flex items-center gap-3 rounded-ousi-xl bg-ousi-surface px-4 py-3">
      <OSwitch :model-value="alerts" label="Late order alerts" @update:model-value="onAlerts" />
    </div>
    <OButton variant="outline" @click="start">Try it</OButton>
    <OTour v-model="open" v-model:step="step" :steps="steps" />
  </div>
</template>
