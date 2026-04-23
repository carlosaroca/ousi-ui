<script setup lang="ts">
import { OCard, OCardHeader, OCardTitle, OCardDescription, OCardContent, OCardFooter, OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <OCard v-for="v in (['transparent', 'default', 'secondary', 'tertiary'] as const)" :key="v" :variant="v">
      <OCardHeader>
        <OCardTitle>{{ v.charAt(0).toUpperCase() + v.slice(1) }}</OCardTitle>
        <OCardDescription>The {{ v }} card variant.</OCardDescription>
      </OCardHeader>
      <OCardContent>
        <p class="text-sm text-ousi-muted">Card content here.</p>
      </OCardContent>
      <OCardFooter>
        <OButton size="sm" variant="secondary">Action</OButton>
      </OCardFooter>
    </OCard>
  </div>
</template>
