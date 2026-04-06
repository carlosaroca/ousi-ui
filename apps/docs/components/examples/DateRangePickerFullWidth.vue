<script setup lang="ts">
import { ODateRangePicker } from '@ousi-ui/vue'
const range = ref(null)
</script>
<template>
  <ODateRangePicker v-model="range" label="Date range" full-width />
</template>
