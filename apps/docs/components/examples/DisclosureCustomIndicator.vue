<script setup lang="ts">
import { ODisclosure } from '@ousi-ui/vue'
</script>
<template>
  <ODisclosure class="border-b border-ousi-border">
    <template #title>Custom indicator</template>
    <template #indicator="{ isOpen }">
      <span class="ml-auto text-xs text-ousi-muted">{{ isOpen ? 'Hide' : 'Show' }}</span>
    </template>
    <p class="text-sm text-ousi-muted">Text instead of chevron indicator.</p>
  </ODisclosure>
</template>
