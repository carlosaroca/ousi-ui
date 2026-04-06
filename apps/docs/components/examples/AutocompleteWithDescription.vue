<script setup lang="ts">
import { OAutocomplete } from '@ousi-ui/vue'

const cities = [
  { value: 'nyc', label: 'New York' },
  { value: 'lon', label: 'London' },
  { value: 'tok', label: 'Tokyo' },
  { value: 'par', label: 'Paris' },
]
</script>
<template>
  <OAutocomplete
    label="City"
    description="Start typing to search cities."
    :options="cities"
    placeholder="Search cities..."
  />
</template>
