<script setup lang="ts">
import { ODateField } from '@ousi-ui/vue'
const date = ref(null)
</script>
<template>
  <ODateField v-model="date" label="Month" granularity="month" />
</template>
