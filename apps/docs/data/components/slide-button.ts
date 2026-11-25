import type { ComponentData } from './types'

export const slideButtonData: ComponentData = {
  title: 'Slide Button',
  description: 'Slide to confirm: for actions that must not happen by accident, such as paying or deleting. It works with a pointer, a finger, the keyboard and a screen reader.',
  category: 'Buttons',
  importCode: 'import { OSlideButton } from \'@ousi-ui/vue\'',

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SlideButtonBasic',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OSlideButton } from '@ousi-ui/vue'

const paid = ref(false)
const paying = ref(false)

function pay() {
  paying.value = true
  setTimeout(() => (paying.value = false), 1600) // your request goes here
}
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <OSlideButton
      v-model="paid"
      :loading="paying"
      label="Slide to pay $48.00"
      loading-label="Paying…"
      confirmed-label="Paid"
      haptic="success"
      @confirm="pay"
    />
    <OButton variant="text" size="sm" :disabled="!paid || paying" @click="paid = false">Start over</OButton>
  </div>
</template>`,
      },
    },
    {
      id: 'slots',
      title: 'Icons and texts',
      example: {
        component: 'SlideButtonSlots',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OSlideButton } from '@ousi-ui/vue'

const unlocked = ref(false)
const deleted = ref(false)
const deleting = ref(false)
const paid = ref(false)

function remove() {
  deleting.value = true
  setTimeout(() => (deleting.value = false), 1600)
}
function again() {
  unlocked.value = deleted.value = paid.value = false
}
</script>
<template>
  <div class="flex w-full max-w-xs flex-col gap-3">
    <!-- Only the icons: the texts stay as they are. -->
    <OSlideButton v-model="unlocked" label="Slide to unlock" confirmed-label="Unlocked" variant="success" full-width>
      <template #icon>
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </template>
      <template #confirmed-icon>
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 7.5-2" />
        </svg>
      </template>
    </OSlideButton>

    <!-- An icon and a text for each state. Screen readers hear what these texts say. -->
    <OSlideButton v-model="deleted" :loading="deleting" variant="danger" full-width @confirm="remove">
      <template #icon>
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 7h14M10 7V4.5h4V7M7 7l1 12.5h8L17 7" />
        </svg>
      </template>
      <template #loading-icon>
        <span class="flex gap-0.5" aria-hidden="true">
          <span v-for="i in 3" :key="i" class="size-1.5 animate-pulse rounded-full bg-current" :style="{ animationDelay: \`\${i * 150}ms\` }" />
        </span>
      </template>
      <template #label>
        <span class="truncate">Delete <strong>report.pdf</strong></span>
      </template>
      <template #loading-label>Deleting…</template>
      <template #confirmed-label>
        <span class="truncate text-ousi-danger-soft-strong">File deleted</span>
      </template>
    </OSlideButton>

    <!-- Every slot gets progress, from 0 to 1: this icon turns as it is dragged. -->
    <OSlideButton v-model="paid" size="lg" full-width>
      <template #icon="{ progress }">
        <svg class="size-5" :style="{ transform: \`rotate(\${progress * 360}deg)\` }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M7 6l6 6-6 6M13 6l6 6-6 6" />
        </svg>
      </template>
      <template #label>
        <span class="text-ousi-muted">Pay</span>
        <span class="font-semibold tabular-nums">$48.00</span>
      </template>
    </OSlideButton>

    <OButton variant="text" size="sm" class="self-center" :disabled="deleting || !(unlocked || deleted || paid)" @click="again">Start over</OButton>
  </div>
</template>`,
      },
    },
    {
      id: 'failure',
      title: 'When the action fails',
      example: {
        component: 'SlideButtonFailure',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OSlideButton } from '@ousi-ui/vue'

const sent = ref(false)
const sending = ref(false)
const problem = ref('')

// An action that fails: setting v-model back to false returns the thumb to the start.
function send() {
  problem.value = ''
  sending.value = true
  setTimeout(() => {
    sending.value = false
    sent.value = false
    problem.value = 'It could not be sent. Slide again to retry.'
  }, 1400)
}
</script>
<template>
  <div class="flex flex-col items-center gap-2">
    <OSlideButton v-model="sent" :loading="sending" label="Slide to send" loading-label="Sending…" @confirm="send" />
    <p class="h-5 text-sm text-ousi-danger" role="alert">{{ problem }}</p>
  </div>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants and sizes',
      example: {
        component: 'SlideButtonVariants',
        code: `<script setup lang="ts">
import { OSlideButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex w-full max-w-xs flex-col gap-3">
    <OSlideButton size="sm" label="Slide to accept" full-width />
    <OSlideButton variant="success" label="Slide to start the trip" full-width />
    <OSlideButton variant="danger" size="lg" label="Slide to delete" confirmed-label="Deleted" full-width />
    <OSlideButton label="Not available yet" disabled full-width />
  </div>
</template>`,
      },
    },
    {
      id: 'shape',
      title: 'Shape and theme tokens',
      example: {
        component: 'SlideButtonShape',
        code: `<script setup lang="ts">
import { OSlideButton } from '@ousi-ui/vue'
</script>
<template>
  <!-- The shape comes from one radius, the button's by default. The thumb stays concentric with
       it, so any value looks right. A theme that changes --ousi-radius changes it too. -->
  <div class="flex w-full max-w-xs flex-col gap-3">
    <OSlideButton label="The theme's radius" full-width />
    <OSlideButton label="Softer corners" full-width class="[--slide-radius:var(--ousi-radius-2xl)]" />
    <OSlideButton label="Square" full-width class="[--slide-radius:0px]" />
    <OSlideButton label="Taller, with a shadow" full-width shadow="md" class="[--slide-h:4rem]" />
  </div>
</template>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'boolean', default: '-', description: 'Whether it has been slid to the end (v-model). Set it to false to send the thumb back. Optional: it keeps its own state.' },
    { name: 'label', type: 'string', default: '\'Slide to confirm\'', description: 'What sliding will do. Also its accessible name, which wins over what the #label slot writes.' },
    { name: 'confirmedLabel', type: 'string', default: '\'Confirmed\'', description: 'Shown once confirmed.' },
    { name: 'loadingLabel', type: 'string', default: 'label', description: 'Shown while loading.' },
    { name: 'variant', type: '\'primary\' | \'success\' | \'danger\'', default: '\'primary\'', description: 'Colour of the thumb and of the confirmed track.' },
    { name: 'size', type: '\'sm\' | \'md\' | \'lg\'', default: '\'md\'', description: 'Height: 2.5rem, 3rem or 3.5rem.' },
    { name: 'threshold', type: 'number', default: '0.9', description: 'How far along it must be let go to confirm, from 0.5 to 1.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'A spinner in the thumb while the confirmed action runs.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether it can be used.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Take the width of the parent. Otherwise 18rem.' },
    { name: 'shadow', type: '\'none\' | \'xs\' | \'sm\' | \'md\'', default: '\'none\'', description: 'Elevation shadow.' },
    { name: 'haptic', type: 'HapticInput', default: '\'none\'', description: 'Vibration on confirming, on devices that have it.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes. The shape follows --slide-radius (the button radius token by default), the height --slide-h and the space around the thumb --slide-pad. The border follows --ousi-border-width.' },
  ],

  slots: [
    { name: 'icon', type: '{ progress, confirmed, loading }', description: 'Icon in the thumb before confirming. Replaces the arrow, and is not mirrored in right-to-left. Size it yourself, as with size-5.' },
    { name: 'loading-icon', type: '{ progress, confirmed, loading }', description: 'Icon while loading. Replaces the spinner.' },
    { name: 'confirmed-icon', type: '{ progress, confirmed, loading }', description: 'Icon once confirmed. Replaces the check.' },
    { name: 'label', type: '{ progress, confirmed, loading }', description: 'Text on the track before confirming. Without a label prop, what it writes is the accessible name; mark decoration with aria-hidden="true".' },
    { name: 'loading-label', type: '{ progress, confirmed, loading }', description: 'Text while loading. Without it: loadingLabel, or else what shows before confirming.' },
    { name: 'confirmed-label', type: '{ progress, confirmed, loading }', description: 'Text once confirmed. Without it: confirmedLabel. Screen readers announce what it writes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: boolean]', description: 'Slid to the end, or sent back.' },
    { name: 'confirm', type: '[]', description: 'Slid to the end: run the action.' },
  ],

  methods: [
    { name: 'reset', type: '() => void', description: 'Sends the thumb back to the start.' },
    { name: 'focus', type: '() => void', description: 'Focuses the thumb.' },
  ],

  keyboard: [
    { key: 'right', description: 'Moves the thumb a quarter of the way (left in right-to-left). Four presses confirm. A held key counts once.' },
    { key: 'left', description: 'Moves it back a quarter.' },
    { key: 'end', description: 'Confirms.' },
    { key: 'home', description: 'Returns it to the start.' },
    { key: 'escape', description: 'Returns it to the start.' },
  ],

  aria: [
    { attribute: 'role="slider"', condition: 'on the thumb', description: 'Named by the label, with its position from 0 to 100.' },
    { attribute: 'role="status"', condition: 'always', description: 'Announces the loading and confirmed texts.' },
  ],
}
