<script setup lang="ts">
import { ref } from 'vue'
import { OTimePicker } from '@ousi-ui/vue'
import type { TimeFieldValue } from '@ousi-ui/vue'

const time = ref<TimeFieldValue | null>(null)
</script>
<template>
  <OTimePicker v-model="time" label="Time" />
</template>
