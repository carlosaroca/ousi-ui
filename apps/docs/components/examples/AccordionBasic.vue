<script setup lang="ts">
import { OAccordion } from '@ousi-ui/vue'
</script>
<template>
  <OAccordion class="max-w-md" :items="[
    { key: 'fav', title: 'Favorites', description: 'Quickly access your saved items and bookmarks from one place.' },
    { key: 'sched', title: 'Schedule', description: 'Keep track of your events and deadlines. Our calendar integration ensures you never miss an important date or appointment.' },
    { key: 'shop', title: 'Shopping', description: 'Browse products, manage your cart, and track your orders.' },
    { key: 'alerts', title: 'Alerts', description: 'Configure notifications and stay up to date.' },
    { key: 'finance', title: 'Finance', description: 'Track expenses, budgets, and financial goals.' },
  ]" />
</template>
