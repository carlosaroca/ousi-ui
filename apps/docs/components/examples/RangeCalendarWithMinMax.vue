<script setup lang="ts">
import { ORangeCalendar } from '@ousi-ui/vue'
const range = ref(null)
</script>
<template>
  <ORangeCalendar
    v-model="range"
    :min-value="{ year: 2026, month: 1, day: 1 }"
    :max-value="{ year: 2026, month: 6, day: 30 }"
  />
</template>
