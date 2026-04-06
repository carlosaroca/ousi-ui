<script setup lang="ts">
import { ORangeCalendar } from '@ousi-ui/vue'
const range = ref({
  start: { year: 2026, month: 4, day: 5 },
  end: { year: 2026, month: 4, day: 12 },
})
</script>
<template>
  <ORangeCalendar :model-value="range" @update:model-value="range = $event" />
</template>
