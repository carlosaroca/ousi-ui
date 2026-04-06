<script setup lang="ts">
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
  <div class="mt-4 flex gap-2">
    <OButton :disabled="currentStep === 0" @click="currentStep--">Previous</OButton>
    <OButton :disabled="currentStep === steps.length - 1" @click="currentStep++">Next</OButton>
  </div>
</template>
