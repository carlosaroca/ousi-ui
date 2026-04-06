<script setup lang="ts">
import { ODatePicker } from '@ousi-ui/vue'
const date = ref(null)
</script>
<template>
  <ODatePicker v-model="date" label="Date" error-message="Please select a valid date." />
</template>
