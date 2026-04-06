<script setup lang="ts">
import { OSelect } from '@ousi-ui/vue'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]
</script>
<template>
  <OSelect full-width :options="options" placeholder="Full width" />
</template>
