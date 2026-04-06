<script setup lang="ts">
import { ref } from 'vue'
import { OTabs } from '@ousi-ui/vue'
const activeTab = ref('account')
const items = [
  { key: 'account', label: 'Account' },
  { key: 'security', label: 'Security' },
]
</script>
<template>
  <OTabs v-model="activeTab" :items="items">
    <template #account>Account panel.</template>
    <template #security>Security panel.</template>
  </OTabs>
  <p class="mt-2 text-sm text-ousi-muted-foreground">Active: {{ activeTab }}</p>
</template>
