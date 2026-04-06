<script setup lang="ts">
import { ref } from 'vue'
import { OTimelineNav } from '@ousi-ui/vue'

const active = ref('avatar')

const sections = [
  {
    title: 'Media',
    items: [
      { key: 'avatar', label: 'Avatar' },
      { key: 'carousel', label: 'Carousel' },
      { key: 'image-compare', label: 'ImageCompare' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { key: 'toast', label: 'Toast' },
      { key: 'alert', label: 'Alert' },
      { key: 'progress', label: 'ProgressBar' },
      { key: 'confetti', label: 'Confetti', badge: 'New' },
      { key: 'haptics', label: 'Haptics', badge: 'Soon' },
    ],
  },
]
</script>
<template>
  <div class="max-w-xs">
    <OTimelineNav v-model="active" :sections="sections" />
  </div>
</template>
