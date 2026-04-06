<script setup lang="ts">
import { OSelect } from '@ousi-ui/vue'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]
</script>
<template>
  <OSelect disabled :options="options" placeholder="Disabled" />
</template>
