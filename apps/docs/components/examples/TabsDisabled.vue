<script setup lang="ts">
import { OTabs } from '@ousi-ui/vue'
const items = [
  { key: 'active', label: 'Active' },
  { key: 'disabled', label: 'Disabled', disabled: true },
  { key: 'other', label: 'Other' },
]
</script>
<template>
  <OTabs :items="items">
    <template #active>Active tab content.</template>
    <template #other>Other tab content.</template>
  </OTabs>
</template>
