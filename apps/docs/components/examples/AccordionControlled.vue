<script setup lang="ts">
import { ref } from 'vue'
import { OAccordion, OButton } from '@ousi-ui/vue'
const open = ref<string | null>('sched')
const items = [
  { key: 'fav', title: 'Favorites', description: 'Your saved items.' },
  { key: 'sched', title: 'Schedule', description: 'Your events and deadlines.' },
  { key: 'shop', title: 'Shopping', description: 'Your cart and orders.' },
]
</script>
<template>
  <div class="flex flex-col gap-4 max-w-md">
    <OAccordion v-model="open" :items="items" />
    <div class="flex gap-2">
      <OButton size="sm" variant="secondary" @click="open = 'fav'">Open Favorites</OButton>
      <OButton size="sm" variant="secondary" @click="open = null">Close all</OButton>
    </div>
    <p class="text-xs text-ousi-muted">Open: {{ open ?? 'none' }}</p>
  </div>
</template>
