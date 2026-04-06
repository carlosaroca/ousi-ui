import type { ComponentData } from './types'

export const confettiData: ComponentData = {
  title: 'Confetti',
  description: 'Celebratory confetti burst effect triggered programmatically.',
  category: 'Feedback',
  importCode: "import { OConfetti } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ConfettiBasic',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const confettiRef = ref()
</script>

<template>
  <OButton @click="confettiRef?.fire()">🎉 Celebrate!</OButton>
  <OConfetti ref="confettiRef" />
</template>`,
      },
    },
    {
      id: 'custom-colors',
      title: 'Custom Colors',
      example: {
        component: 'ConfettiColors',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const confettiRef = ref()
const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff']
</script>

<template>
  <OButton @click="confettiRef?.fire()">🌈 Rainbow Burst</OButton>
  <OConfetti ref="confettiRef" :colors="colors" :particle-count="120" />
</template>`,
      },
    },
  ],

  props: [
    { name: 'particleCount', type: 'number', default: '80', description: 'Number of confetti particles to emit.' },
    { name: 'spread', type: 'number', default: '70', description: 'Spread angle in degrees for the confetti burst.' },
    { name: 'duration', type: 'number', default: '3000', description: 'Duration in milliseconds before particles fade out.' },
    { name: 'colors', type: 'string[]', default: '-', description: 'Custom array of hex color strings for the confetti particles.' },
  ],

  emits: [
    { name: 'complete', type: '() => void', description: 'Emitted when the confetti animation finishes.' },
  ],
}
