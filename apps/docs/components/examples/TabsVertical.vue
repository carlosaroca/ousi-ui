<script setup lang="ts">
import { OTabs } from '@ousi-ui/vue'
const items = [
  { key: 'general', label: 'General' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'notifications', label: 'Notifications' },
]
</script>
<template>
  <OTabs orientation="vertical" :items="items">
    <template #general>General settings panel.</template>
    <template #appearance>Appearance settings panel.</template>
    <template #notifications>Notification preferences panel.</template>
  </OTabs>
</template>
