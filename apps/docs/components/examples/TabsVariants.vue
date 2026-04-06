<script setup lang="ts">
import { OTabs } from '@ousi-ui/vue'
const items = [
  { key: 'tab1', label: 'Tab 1' },
  { key: 'tab2', label: 'Tab 2' },
]
</script>
<template>
  <div class="flex flex-col gap-6">
    <OTabs variant="primary" :items="items">
      <template #tab1>Primary variant content.</template>
      <template #tab2>Second tab content.</template>
    </OTabs>
    <OTabs variant="secondary" :items="items">
      <template #tab1>Secondary variant content.</template>
      <template #tab2>Second tab content.</template>
    </OTabs>
  </div>
</template>
