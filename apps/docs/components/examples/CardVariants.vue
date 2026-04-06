<script setup lang="ts">
import { OCard, OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <OCard v-for="v in (['transparent', 'default', 'secondary', 'tertiary'] as const)" :key="v" :variant="v">
      <OCard.Header>
        <OCard.Title>{{ v.charAt(0).toUpperCase() + v.slice(1) }}</OCard.Title>
        <OCard.Description>The {{ v }} card variant.</OCard.Description>
      </OCard.Header>
      <OCard.Content>
        <p class="text-sm text-ousi-muted">Card content here.</p>
      </OCard.Content>
      <OCard.Footer>
        <OButton size="sm" variant="secondary">Action</OButton>
      </OCard.Footer>
    </OCard>
  </div>
</template>
