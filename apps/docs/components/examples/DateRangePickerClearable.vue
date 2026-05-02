<script setup lang="ts">
import { ref } from 'vue'
import { ODateRangePicker, OButton } from '@ousi-ui/vue'
import type { DateRangeValue } from '@ousi-ui/vue'

const range = ref<DateRangeValue | null>({
  start: { year: 2026, month: 5, day: 1 },
  end:   { year: 2026, month: 5, day: 14 },
})
</script>
<template>
  <div class="flex flex-col gap-3 items-start">
    <ODateRangePicker v-model="range" label="Trip dates" class="w-full" />
    <div class="flex items-center gap-2">
      <OButton size="sm" variant="text" @click="range = null">Clear</OButton>
      <span class="text-xs text-ousi-muted font-mono">
        {{ range ? `${range.start?.year}-${range.start?.month}-${range.start?.day} → ${range.end?.year}-${range.end?.month}-${range.end?.day}` : 'null' }}
      </span>
    </div>
  </div>
</template>
