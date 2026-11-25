import type { ComponentData } from './types'

export const tourData: ComponentData = {
  title: 'Tour',
  description: 'Walk through parts of the screen, one at a time, over a scrim with the part in question left in view.',
  category: 'Overlays',
  importCode: 'import { OTour } from \'@ousi-ui/vue\'',

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TourBasic',
        code: `<script setup lang="ts">
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
</template>`,
      },
    },
    {
      id: 'interactive',
      title: 'Using the highlighted part',
      example: {
        component: 'TourInteractive',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OSwitch, OTour } from '@ousi-ui/vue'
import type { TourStep } from '@ousi-ui/vue'

const open = ref(false)
const step = ref(0)
const alerts = ref(false)
const steps: TourStep[] = [
  // \`interactive\` leaves the highlighted part usable: here, the switch moves the tour on.
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
</template>`,
      },
    },
    {
      id: 'custom',
      title: 'Custom content and buttons',
      example: {
        component: 'TourCustom',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OTour } from '@ousi-ui/vue'

const open = ref(false)
const steps = [
  { id: 'export', target: '#tour-export', title: 'Export', description: 'Download what you see.' },
  { id: 'share', target: '#tour-share', title: 'Share', description: 'Send a link to your team.' },
]
</script>
<template>
  <div class="flex flex-col items-center gap-5">
    <div class="flex gap-3">
      <OButton id="tour-export" variant="secondary">Export</OButton>
      <OButton id="tour-share" variant="secondary">Share</OButton>
    </div>
    <OButton variant="outline" @click="open = true">What is new?</OButton>

    <OTour v-model="open" :steps="steps" :show-progress="false">
      <template #default="{ step }">
        <p v-if="step.id === 'share'" class="rounded-ousi-lg bg-ousi-default px-3 py-2 text-xs">Links expire after 30 days.</p>
      </template>
      <template #footer="{ index, total, next, close }">
        <div class="flex justify-end gap-2">
          <OButton variant="text" size="sm" @click="close">Not now</OButton>
          <OButton size="sm" data-autofocus @click="next">{{ index === total - 1 ? 'Got it' : 'Show me more' }}</OButton>
        </div>
      </template>
    </OTour>
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'steps', type: 'TourStep[]', default: '-', description: 'Each: { id?, target?, title, description?, placement?, interactive? }. target is a CSS selector, an element or a function returning one; without it, or if it cannot be found within 600 ms, the step shows in the middle of the screen.' },
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Whether the tour is running (v-model).' },
    { name: 'step', type: 'number', default: '-', description: 'The current step, from 0 (v-model:step). Optional: uncontrolled, every run starts at the first.' },
    { name: 'padding', type: 'number', default: '8', description: 'Space between the target and the edge of the highlight, in px.' },
    { name: 'showProgress', type: 'boolean', default: 'true', description: 'A dot per step and "2 of 5".' },
    { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'The button that leaves the tour.' },
    { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Leave the tour with Escape.' },
    { name: 'shadow', type: '\'md\' | \'lg\' | \'xl\' | \'2xl\'', default: '\'xl\'', description: 'Elevation of the card.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the card. The card follows the popover tokens; the highlight takes its radius from --tour-radius and its scrim from --ousi-backdrop.' },
  ],

  slots: [
    { name: 'default', type: '{ step, index, total, next, prev, close }', description: 'More content under the description.' },
    { name: 'footer', type: '{ step, index, total, next, prev, close }', description: 'Replaces the progress and the buttons. Mark the main one with data-autofocus.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[open: boolean]', description: 'The tour closed.' },
    { name: 'update:step', type: '[step: number]', description: 'Moved to another step.' },
    { name: 'finish', type: '[]', description: 'The last step was completed.' },
    { name: 'skip', type: '[step: number]', description: 'Left before the end, at this step.' },
  ],

  methods: [
    { name: 'next', type: '() => void', description: 'The next step, or finish on the last.' },
    { name: 'prev', type: '() => void', description: 'The previous step.' },
    { name: 'goTo', type: '(step: number) => void', description: 'Jumps to a step.' },
    { name: 'close', type: '() => void', description: 'Leaves the tour.' },
  ],

  keyboard: [
    { key: 'right', description: 'Next step (left in right-to-left). It does not finish the tour.' },
    { key: 'left', description: 'Previous step.' },
    { key: 'escape', description: 'Leaves the tour.' },
    { key: 'tab', description: 'Stays in the card, except on an interactive step.' },
  ],

  aria: [
    { attribute: 'role="dialog"', condition: 'on the card', description: 'Named by the title and described by the description.' },
    { attribute: 'aria-modal="true"', condition: 'unless the step is interactive', description: 'The page behind is out of reach.' },
    { attribute: 'aria-live="polite"', condition: 'always', description: 'Reads each step, with its position.' },
  ],
}
