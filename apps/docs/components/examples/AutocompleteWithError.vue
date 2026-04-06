<script setup lang="ts">
import { OAutocomplete } from '@ousi-ui/vue'

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
]
</script>
<template>
  <OAutocomplete
    label="Country"
    error-message="Please select a valid country."
    :options="countries"
  />
</template>
