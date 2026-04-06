<script setup lang="ts">
import { OSelect } from '@ousi-ui/vue'

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
]
</script>
<template>
  <div class="flex flex-col gap-4">
    <OSelect variant="primary" :options="options" placeholder="Primary" />
    <OSelect variant="secondary" :options="options" placeholder="Secondary" />
  </div>
</template>
