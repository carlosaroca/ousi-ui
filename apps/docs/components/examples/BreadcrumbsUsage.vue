<script setup lang="ts">
import { OBreadcrumbs } from '@ousi-ui/vue'
const items = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Breadcrumbs' },
]
</script>
<template>
  <OBreadcrumbs :items="items" />
</template>
