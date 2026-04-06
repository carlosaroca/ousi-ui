<script setup lang="ts">
import { OTabs } from '@ousi-ui/vue'
const items = [
  { key: 'account', label: 'Account' },
  { key: 'security', label: 'Security' },
  { key: 'billing', label: 'Billing' },
]
</script>
<template>
  <OTabs :items="items">
    <template #account>Account settings here.</template>
    <template #security>Security settings here.</template>
    <template #billing>Billing info here.</template>
  </OTabs>
</template>
