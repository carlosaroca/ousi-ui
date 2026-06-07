<script setup lang="ts">
import { OTabs } from '@ousi-ui/vue'
const items = [
  { key: 'tab1', label: 'Tab 1' },
  { key: 'tab2', label: 'Tab 2' },
  { key: 'tab3', label: 'Tab 3' },
]
</script>
<template>
  <div class="flex flex-col gap-6">
    <OTabs variant="secondary" :items="items">
      <template #tab1>With track border (default).</template>
      <template #tab2>Second tab content.</template>
      <template #tab3>Third tab content.</template>
    </OTabs>
    <OTabs variant="secondary" hide-border :items="items">
      <template #tab1>Track border hidden — active indicator unaffected.</template>
      <template #tab2>Second tab content.</template>
      <template #tab3>Third tab content.</template>
    </OTabs>
  </div>
</template>
