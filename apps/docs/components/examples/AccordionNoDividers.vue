<script setup lang="ts">
import { OAccordion } from '@ousi-ui/vue'
</script>
<template>
  <OAccordion :show-dividers="false" class="max-w-md" :items="[
    { key: 'fav', title: 'Favorites', description: 'Your saved items and bookmarks.' },
    { key: 'sched', title: 'Schedule', description: 'Track your events and deadlines.' },
    { key: 'shop', title: 'Shopping', description: 'Browse products and manage orders.' },
  ]" />
</template>
