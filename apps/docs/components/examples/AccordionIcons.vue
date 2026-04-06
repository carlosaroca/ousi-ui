<script setup lang="ts">
import { OAccordion } from '@ousi-ui/vue'
const items = [
  { key: 'fav', title: 'Favorites', description: 'Quickly access your saved items and bookmarks.' },
  { key: 'sched', title: 'Schedule', description: 'Keep track of your events and deadlines.' },
  { key: 'shop', title: 'Shopping', description: 'Browse products and manage your cart.' },
  { key: 'alerts', title: 'Alerts', description: 'Configure your notifications.' },
  { key: 'finance', title: 'Finance', description: 'Track expenses and budgets.' },
]
</script>
<template>
  <OAccordion class="max-w-md" :items="items">
    <template #icon-fav>
      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    </template>
    <template #icon-sched>
      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
    </template>
    <template #icon-shop>
      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
    </template>
    <template #icon-alerts>
      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"/></svg>
    </template>
    <template #icon-finance>
      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
    </template>
  </OAccordion>
</template>
