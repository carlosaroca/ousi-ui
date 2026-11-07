<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

// Token names follow the theme; any CSS color works too.
const tokens = [
  { label: 'A', value: 90, color: 'danger' },
  { label: 'B', value: 70, color: 'warning' },
  { label: 'C', value: 50, color: 'success' },
  { label: 'D', value: 30, color: 'accent' },
]
const custom = [
  { label: 'A', value: 90, color: '#f43f5e' },
  { label: 'B', value: 70, color: 'rgb(251 146 60)' },
  { label: 'C', value: 50, color: 'hsl(160 84% 39%)' },
  { label: 'D', value: 30, color: 'var(--ousi-violet)' },
]
</script>
<template>
  <div class="flex flex-wrap items-center gap-10">
    <div class="flex flex-col items-center gap-2">
      <OActivityRings :rings="tokens" :size="150" :stroke-width="9" :gap="3" />
      <span class="text-xs text-ousi-muted">Theme tokens</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <OActivityRings :rings="custom" :size="150" :stroke-width="9" :gap="3" />
      <span class="text-xs text-ousi-muted">hex · rgb · hsl · var()</span>
    </div>
  </div>
</template>
