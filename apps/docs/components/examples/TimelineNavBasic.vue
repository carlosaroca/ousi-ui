<script setup lang="ts">
import { ref } from 'vue'
import { OTimelineNav } from '@ousi-ui/vue'

const active = ref('button')

const sections = [
  {
    title: 'Getting Started',
    items: [
      { key: 'intro', label: 'Introduction' },
      { key: 'install', label: 'Installation' },
      { key: 'theming', label: 'Theming' },
    ],
  },
  {
    title: 'Components',
    items: [
      { key: 'button', label: 'Button' },
      { key: 'input', label: 'Input' },
      { key: 'select', label: 'Select' },
      { key: 'dialog', label: 'Dialog' },
      { key: 'chart', label: 'Chart' },
    ],
  },
]
</script>
<template>
  <div class="max-w-xs">
    <OTimelineNav v-model="active" :sections="sections" />
    <p class="mt-4 text-xs text-ousi-muted">Active: {{ active }}</p>
  </div>
</template>
