<script setup lang="ts">
import { ref } from 'vue'
import { OCheckbox } from '@ousi-ui/vue'
const terms = ref(false)
</script>
<template>
  <OCheckbox
    v-model="terms"
    label="I agree to the terms"
    :error-message="!terms ? 'You must accept the terms to continue.' : undefined"
  />
</template>
