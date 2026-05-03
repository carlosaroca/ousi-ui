<script setup lang="ts">
import { ref } from 'vue'
import { OTimePicker } from '@ousi-ui/vue'
import type { TimeFieldValue } from '@ousi-ui/vue'

const time = ref<TimeFieldValue | null>({ hour: 10, minute: 0 })
</script>
<template>
  <OTimePicker
    v-model="time"
    label="Office hours"
    description="Restricted to 09:00 – 17:30. Out-of-range hours are dimmed and skipped on scroll."
    :min="{ hour: 9, minute: 0 }"
    :max="{ hour: 17, minute: 30 }"
  />
</template>
