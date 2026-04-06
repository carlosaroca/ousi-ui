<script setup lang="ts">
import { OInput } from '@ousi-ui/vue'
</script>
<template>
  <OInput
    label="Email"
    error-message="Please enter a valid email address."
    model-value="not-an-email"
  />
</template>
