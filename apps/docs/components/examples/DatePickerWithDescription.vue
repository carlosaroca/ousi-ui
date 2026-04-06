<script setup lang="ts">
import { ODatePicker } from '@ousi-ui/vue'
const date = ref(null)
</script>
<template>
  <ODatePicker v-model="date" label="Start date" description="Choose a project start date." />
</template>
