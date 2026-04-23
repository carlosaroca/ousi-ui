<script setup lang="ts">
import { OSelect } from '@ousi-ui/vue'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <OSelect label="Default (static)" :options="options" placeholder="No animation on focus" />
    <OSelect label="Animated" :options="options" placeholder="Scales on focus" animated />
  </div>
</template>
