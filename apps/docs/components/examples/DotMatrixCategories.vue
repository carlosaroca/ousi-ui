<script setup lang="ts">
import { ODotMatrix } from '@ousi-ui/vue'

// Every column can set its own color, and labels go under the matrix.
const data = [
  { label: 'Mon', value: 62, color: 'accent' }, { label: 'Tue', value: 88, color: 'accent' },
  { label: 'Wed', value: 45, color: 'accent' }, { label: 'Thu', value: 95, color: 'success' },
  { label: 'Fri', value: 71, color: 'accent' }, { label: 'Sat', value: 30, color: 'orange' },
  { label: 'Sun', value: 18, color: 'orange' },
]
</script>
<template>
  <div class="max-w-md">
    <ODotMatrix :data="data" :max="100" :rows="6" :dot-size="26" :gap="10" show-labels :format-value="(v) => `${v} pts`" />
    <p class="mt-3 text-xs text-ousi-muted"><span class="text-ousi-success-soft-strong">Green</span>: best day · <span class="text-ousi-orange-soft-strong">orange</span>: weekend</p>
  </div>
</template>
