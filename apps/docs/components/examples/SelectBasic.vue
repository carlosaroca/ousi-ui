<script setup lang="ts">
import { OSelect } from '@ousi-ui/vue'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>
<template>
  <OSelect :options="options" placeholder="Choose a fruit" />
</template>
