<script setup lang="ts">
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
  <div class="w-full max-w-md flex flex-col gap-4">
    <OStepper v-model="current" :steps="steps" clickable />
    <div class="flex gap-2 justify-end">
      <OButton v-if="current > 0" variant="flat" size="sm" @click="current = current === 2 ? 0 : current - 1">Previous</OButton>
      <OButton v-if="current < steps.length - 1" size="sm" @click="current = current === 0 ? 2 : current + 1">Next</OButton>
    </div>
    <p class="text-xs text-ousi-muted">Step "Config" is disabled and will be skipped.</p>
  </div>
</template>
