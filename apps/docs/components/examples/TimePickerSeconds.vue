<script setup lang="ts">
import { ref } from 'vue'
import { OTimePicker } from '@ousi-ui/vue'
import type { TimeFieldValue } from '@ousi-ui/vue'

const time = ref<TimeFieldValue | null>({ hour: 9, minute: 15, second: 30 })
</script>
<template>
  <OTimePicker v-model="time" granularity="second" :interval="1" label="Stopwatch start" />
</template>
