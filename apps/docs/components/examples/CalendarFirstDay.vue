<script setup lang="ts">
import { ref } from 'vue'
import { OCalendar } from '@ousi-ui/vue'

const date = ref(null)
</script>
<template>
  <OCalendar v-model="date" :first-day-of-week="1" />
</template>
