<script setup lang="ts">
import { OCalendar } from '@ousi-ui/vue'
const date = ref(null)
</script>
<template>
  <OCalendar v-model="date" :indicator-days="[3, 10, 15, 22]" />
</template>
