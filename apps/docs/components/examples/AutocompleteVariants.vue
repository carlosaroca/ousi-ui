<script setup lang="ts">
import { OAutocomplete } from '@ousi-ui/vue'

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
]
</script>
<template>
  <div class="flex flex-col gap-4">
    <OAutocomplete variant="primary" :options="options" placeholder="Primary" />
    <OAutocomplete variant="secondary" :options="options" placeholder="Secondary" />
  </div>
</template>
