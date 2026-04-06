<script setup lang="ts">
import { OAutocomplete } from '@ousi-ui/vue'

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
]
</script>
<template>
  <OAutocomplete label="Framework" :options="frameworks" placeholder="Search..." />
</template>
