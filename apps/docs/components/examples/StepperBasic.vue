<script setup lang="ts">
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
</template>
