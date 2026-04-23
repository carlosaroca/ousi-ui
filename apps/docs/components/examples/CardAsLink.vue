<script setup lang="ts">
import { OCard, OCardHeader, OCardTitle, OCardDescription, OCardFooter } from '@ousi-ui/vue'
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
    <OCard as="a" href="#" variant="secondary" class="hover:bg-ousi-surface-tertiary transition-colors cursor-pointer no-underline">
      <OCardHeader>
        <OCardTitle>Documentation</OCardTitle>
        <OCardDescription>Read the full API reference and guides.</OCardDescription>
      </OCardHeader>
      <OCardFooter class="text-ousi-accent text-sm gap-1">
        Learn more
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </OCardFooter>
    </OCard>
    <OCard as="a" href="#" variant="secondary" class="hover:bg-ousi-surface-tertiary transition-colors cursor-pointer no-underline">
      <OCardHeader>
        <OCardTitle>GitHub</OCardTitle>
        <OCardDescription>Star the repo and contribute.</OCardDescription>
      </OCardHeader>
      <OCardFooter class="text-ousi-accent text-sm gap-1">
        View source
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </OCardFooter>
    </OCard>
  </div>
</template>
