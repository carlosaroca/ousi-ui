<script setup lang="ts">
import { ref } from 'vue'
import { OCalendar } from '@ousi-ui/vue'
import type { CalendarDate } from '@ousi-ui/vue'
const date = ref<CalendarDate | null>(null)
</script>
<template>
  <div class="flex flex-col gap-2">
    <OCalendar
      v-model="date"
      :unavailable-dates="[
        { year: 2026, month: 4, day: 5 },
        { year: 2026, month: 4, day: 12 },
        { year: 2026, month: 4, day: 19 },
        { year: 2026, month: 4, day: 26 },
      ]"
    />
    <p class="text-xs text-ousi-muted">Saturdays in April are unavailable.</p>
  </div>
</template>
