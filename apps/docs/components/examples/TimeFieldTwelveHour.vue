<script setup lang="ts">
import { OTimeField } from '@ousi-ui/vue'
const time = ref(null)
</script>
<template>
  <OTimeField v-model="time" label="Time" hour12 />
</template>
