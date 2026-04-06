<script setup lang="ts">
import { OBreadcrumbs } from '@ousi-ui/vue'
const items = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Breadcrumbs' },
]
</script>
<template>
  <div class="flex flex-col gap-4">
    <OBreadcrumbs :items="items" separator="slash" />
    <OBreadcrumbs :items="items" separator="dot" />
  </div>
</template>
