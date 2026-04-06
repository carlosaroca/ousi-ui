import type { ComponentData } from './types'

export const stepperData: ComponentData = {
  title: 'Stepper',
  description: 'A step-by-step progress indicator for multi-step workflows.',
  category: 'Navigation',
  importCode: "import { OStepper } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'StepperBasic',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const currentStep = ref(0)
const steps = [
  { title: 'Account' },
  { title: 'Profile' },
  { title: 'Review' },
  { title: 'Complete' },
]
</script>

<template>
  <OStepper v-model="currentStep" :steps="steps" />
  <div class="mt-4 flex gap-2">
    <OButton :disabled="currentStep === 0" @click="currentStep--">Previous</OButton>
    <OButton :disabled="currentStep === steps.length - 1" @click="currentStep++">Next</OButton>
  </div>
</template>`,
      },
    },
    {
      id: 'vertical',
      title: 'Vertical',
      example: {
        component: 'StepperVertical',
        code: `<OStepper
  v-model="currentStep"
  :steps="steps"
  orientation="vertical"
/>`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'StepperBasic',
        code: `<OStepper v-model="currentStep" :steps="steps" size="sm" />
<OStepper v-model="currentStep" :steps="steps" size="md" />
<OStepper v-model="currentStep" :steps="steps" size="lg" />`,
      },
    },
    {
      id: 'clickable',
      title: 'Clickable with Color',
      example: {
        component: 'StepperClickable',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const currentStep = ref(1)
const steps = [
  { title: 'Cart', key: 'cart' },
  { title: 'Shipping', key: 'shipping' },
  { title: 'Payment', key: 'payment' },
  { title: 'Confirm', key: 'confirm' },
]
</script>

<template>
  <OStepper v-model="currentStep" :steps="steps" clickable color="success" />
</template>`,
      },
    },
    {
      id: 'custom-content',
      title: 'Custom Content',
      example: {
        component: 'StepperCustom',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const current = ref(0)
const steps = [
  { title: 'Account', description: 'Create your account', key: 'account' },
  { title: 'Profile', description: 'Set up your profile', key: 'profile' },
  { title: 'Review', description: 'Review your details', key: 'review' },
  { title: 'Complete', description: 'All done!', key: 'complete' },
]
</script>

<template>
  <div class="w-full max-w-lg flex flex-col gap-4">
    <OStepper v-model="current" :steps="steps" clickable />

    <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface p-4">
      <template v-if="current === 0">
        <h4 class="font-medium text-ousi-foreground">Create Account</h4>
        <p class="text-sm text-ousi-muted mt-1">Enter your email and password.</p>
        <OInput placeholder="Email" class="mt-3" />
      </template>
      <template v-else-if="current === 1">
        <h4 class="font-medium text-ousi-foreground">Your Profile</h4>
        <p class="text-sm text-ousi-muted mt-1">Tell us about yourself.</p>
        <OInput placeholder="Full Name" class="mt-3" />
      </template>
      <!-- ... more steps -->
    </div>

    <div class="flex gap-2 justify-end">
      <OButton v-if="current > 0" variant="flat" size="sm" @click="current--">Previous</OButton>
      <OButton v-if="current < steps.length - 1" size="sm" @click="current++">Next</OButton>
    </div>
  </div>
</template>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled Steps',
      example: {
        component: 'StepperDisabled',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const current = ref(0)
const steps = [
  { title: 'Setup', key: 'setup' },
  { title: 'Config', key: 'config', disabled: true },
  { title: 'Deploy', key: 'deploy' },
  { title: 'Done', key: 'done' },
]
</script>

<template>
  <OStepper v-model="current" :steps="steps" clickable />
</template>`,
      },
    },
  ],

  props: [
    { name: 'steps', type: 'StepItem[]', default: '[]', description: 'Array of step items with title and optional description.' },
    { name: 'modelValue', type: 'number', default: '0', description: 'Index of the currently active step.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction of the stepper.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the step indicators.' },
    { name: 'clickable', type: 'boolean', default: 'false', description: 'Allow clicking on steps to navigate directly.' },
    { name: 'color', type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning'", default: "'primary'", description: 'Color theme for completed and active step indicators.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '(index: number) => void', description: 'Fired when the active step changes.' },
    { name: 'change', type: '(index: number) => void', description: 'Fired after a step transition.' },
  ],

  bestPractices: [
    { text: 'Clearly label each step with a concise title.', good: true },
    { text: 'Indicate completed steps visually so users know their progress.', good: true },
    { text: 'Use vertical orientation for narrow layouts or many steps.', good: true },
    { text: 'Allow more than 7 steps in a horizontal stepper, which causes crowding.', good: false },
  ],
}
