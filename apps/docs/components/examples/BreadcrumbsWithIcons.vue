<script setup lang="ts">
import { OBreadcrumbs } from '@ousi-ui/vue'
const items = [
  { label: 'Home', href: '/' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile' },
]
</script>
<template>
  <OBreadcrumbs :items="items">
    <template #item="{ item }">
      <span class="flex items-center gap-1">
        <svg v-if="item.label === 'Home'" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
        {{ item.label }}
      </span>
    </template>
  </OBreadcrumbs>
</template>
