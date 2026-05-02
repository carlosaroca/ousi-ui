<script setup lang="ts">
import { ref } from 'vue'
import { ODatePicker, OButton } from '@ousi-ui/vue'
import type { DateFieldValue } from '@ousi-ui/vue'

const date = ref<DateFieldValue | null>({ year: 2026, month: 5, day: 15 })
</script>
<template>
  <div class="flex flex-col gap-3 items-start">
    <ODatePicker v-model="date" label="Date" class="w-full" />
    <div class="flex items-center gap-2">
      <OButton size="sm" variant="text" @click="date = null">Clear</OButton>
      <span class="text-xs text-ousi-muted font-mono">
        {{ date ? `${date.year}-${date.month}-${date.day}` : 'null' }}
      </span>
    </div>
  </div>
</template>
