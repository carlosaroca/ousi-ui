<script setup lang="ts">
import { OAutocomplete } from '@ousi-ui/vue'

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
]
</script>
<template>
  <OAutocomplete full-width :options="options" placeholder="Full width" />
</template>
