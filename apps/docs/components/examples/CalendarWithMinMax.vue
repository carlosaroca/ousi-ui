<script setup lang="ts">
import { OCalendar } from '@ousi-ui/vue'
const date = ref(null)
</script>
<template>
  <OCalendar
    v-model="date"
    :min-value="{ year: 2026, month: 1, day: 1 }"
    :max-value="{ year: 2026, month: 12, day: 31 }"
  />
</template>
