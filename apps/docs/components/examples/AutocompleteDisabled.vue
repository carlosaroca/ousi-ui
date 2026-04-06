<script setup lang="ts">
import { OAutocomplete } from '@ousi-ui/vue'

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
]
</script>
<template>
  <OAutocomplete disabled :options="options" placeholder="Disabled" />
</template>
