<script setup lang="ts">
import { OAccordion } from '@ousi-ui/vue'
</script>
<template>
  <OAccordion class="max-w-md" :gap="24" :items="[
    { key: '1', title: 'Large gap', description: 'This accordion uses a 24px gap for dramatic separation.' },
    { key: '2', title: 'Between items', description: 'The gap creates a strong visual break.' },
    { key: '3', title: 'When expanded', description: 'Items feel like they float apart.' },
  ]" />
</template>
