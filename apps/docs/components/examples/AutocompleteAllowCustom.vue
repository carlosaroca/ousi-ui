<script setup lang="ts">
import { OAutocomplete } from '@ousi-ui/vue'

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
]
</script>
<template>
  <OAutocomplete
    allow-custom-value
    :options="options"
    placeholder="Type anything..."
  />
</template>
