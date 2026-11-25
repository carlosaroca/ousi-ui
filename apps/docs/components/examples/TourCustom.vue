<script setup lang="ts">
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
</template>
