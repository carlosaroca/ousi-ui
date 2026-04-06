<script setup lang="ts">
import { ref } from 'vue'
import { OCalendar } from '@ousi-ui/vue'
import type { CalendarDate } from '@ousi-ui/vue'
const date = ref<CalendarDate | null>(null)
</script>
<template>
  <OCalendar v-model="date">
    <template #prev-icon>
      <svg class="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
    </template>
    <template #next-icon>
      <svg class="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
    </template>
  </OCalendar>
</template>
