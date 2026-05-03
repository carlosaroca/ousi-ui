<script setup lang="ts">
import { ref } from 'vue'
import { OTimePicker, OButton } from '@ousi-ui/vue'
import type { TimeFieldValue } from '@ousi-ui/vue'

const time = ref<TimeFieldValue | null>({ hour: 14, minute: 30 })
</script>
<template>
  <div class="flex flex-col gap-3 items-start">
    <OTimePicker v-model="time" label="Departure" class="w-full" />
    <div class="flex items-center gap-2">
      <OButton size="sm" variant="text" @click="time = null">Clear</OButton>
      <span class="text-xs text-ousi-muted font-mono">
        {{ time ? `${String(time.hour).padStart(2,'0')}:${String(time.minute).padStart(2,'0')}` : 'null' }}
      </span>
    </div>
  </div>
</template>
