<script setup lang="ts">
import { ref } from 'vue'
import { OTimePicker } from '@ousi-ui/vue'
import type { TimeFieldValue } from '@ousi-ui/vue'

const time = ref<TimeFieldValue | null>({ hour: 14, minute: 30 })
</script>
<template>
  <OTimePicker v-model="time" hour12 label="Meeting time" />
</template>
