<script setup lang="ts">
import { ref } from 'vue'
import { OTimePicker } from '@ousi-ui/vue'
import type { TimeFieldValue } from '@ousi-ui/vue'

const time = ref<TimeFieldValue | null>({ hour: 14, minute: 0 })
</script>
<template>
  <OTimePicker v-model="time" granularity="hour" hour12 label="Reservation hour" />
</template>
