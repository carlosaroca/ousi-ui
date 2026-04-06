<script setup lang="ts">
import { OAutocomplete } from '@ousi-ui/vue'

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]
</script>
<template>
  <OAutocomplete :options="options" placeholder="Search frameworks..." />
</template>
