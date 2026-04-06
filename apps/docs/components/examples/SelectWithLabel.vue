<script setup lang="ts">
import { OSelect } from '@ousi-ui/vue'

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
]
</script>
<template>
  <OSelect label="Country" :options="countries" placeholder="Select a country" />
</template>
