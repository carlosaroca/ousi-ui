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
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <OAutocomplete label="Default (static)" :options="options" placeholder="No animation on focus" />
    <OAutocomplete label="Animated" :options="options" placeholder="Scales on focus" animated />
  </div>
</template>
