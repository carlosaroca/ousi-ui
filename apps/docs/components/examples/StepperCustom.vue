<script setup lang="ts">
import { ref } from 'vue'

const current = ref(1)
const steps = [
  { title: 'Account', description: 'Create your account', key: 'account' },
  { title: 'Profile', description: 'Set up your profile', key: 'profile' },
  { title: 'Review', description: 'Review details', key: 'review' },
  { title: 'Complete', description: 'All done!', key: 'complete' },
]

const icons = ['👤', '⚙️', '🔍', '✅']
</script>

<template>
  <div class="w-full max-w-xl flex flex-col gap-4">
    <OStepper v-model="current" :steps="steps" clickable color="success">
      <template #indicator="{ step, index, state }">
        <div class="flex flex-col items-center gap-2">
          <div
            class="size-10 rounded-full flex items-center justify-center text-lg transition-all"
            :class="[
              state === 'completed' ? 'bg-ousi-success text-white' : '',
              state === 'active' ? 'bg-ousi-success/15 ring-2 ring-ousi-success' : '',
              state === 'upcoming' ? 'bg-ousi-default' : '',
            ]"
          >
            <span v-if="state === 'completed'">✓</span>
            <span v-else>{{ icons[index] }}</span>
          </div>
          <div class="text-center">
            <div class="text-sm font-medium" :class="state === 'active' ? 'text-ousi-foreground' : 'text-ousi-muted'">{{ step.title }}</div>
            <div class="text-xs text-ousi-muted">{{ step.description }}</div>
          </div>
        </div>
      </template>
    </OStepper>

    <div class="flex gap-2 justify-end">
      <OButton v-if="current > 0" variant="flat" size="sm" @click="current--">Previous</OButton>
      <OButton v-if="current < steps.length - 1" size="sm" @click="current++">Next</OButton>
    </div>
  </div>
</template>
