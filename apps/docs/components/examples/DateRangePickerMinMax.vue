<script setup lang="ts">
import { ODateRangePicker } from '@ousi-ui/vue'
const range = ref(null)
</script>
<template>
  <ODateRangePicker
    v-model="range"
    label="Booking"
    :min-value="{ year: 2026, month: 4, day: 1 }"
    :max-value="{ year: 2026, month: 12, day: 31 }"
  />
</template>
