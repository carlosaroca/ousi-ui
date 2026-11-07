<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 80, color: 'danger' },
  { label: 'Exercise', value: 55, color: 'success' },
  { label: 'Stand', value: 30, color: 'accent' },
]
</script>
<template>
  <div class="flex flex-wrap items-center gap-8">
    <OActivityRings :rings="rings" :size="56" :stroke-width="14" :gap="2" :interactive="false" />
    <OActivityRings :rings="rings" :size="110" :stroke-width="12" :gap="3" />
    <OActivityRings :rings="rings" :size="200" :stroke-width="7" :gap="4" />
  </div>
</template>
