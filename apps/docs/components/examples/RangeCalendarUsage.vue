<script setup lang="ts">
import { ORangeCalendar } from '@ousi-ui/vue'
const range = ref(null)
</script>
<template>
  <ORangeCalendar v-model="range" />
</template>
