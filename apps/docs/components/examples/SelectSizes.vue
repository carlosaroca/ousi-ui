<script setup lang="ts">
import { OSelect } from '@ousi-ui/vue'

const options = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]
</script>
<template>
  <div class="flex flex-col gap-4">
    <OSelect size="sm" :options="options" placeholder="Small" />
    <OSelect size="md" :options="options" placeholder="Medium" />
    <OSelect size="lg" :options="options" placeholder="Large" />
  </div>
</template>
