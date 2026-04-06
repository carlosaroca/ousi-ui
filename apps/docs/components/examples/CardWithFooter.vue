<script setup lang="ts">
import { OCard, OButton } from '@ousi-ui/vue'
</script>
<template>
  <OCard>
    <OCard.Header>
      <OCard.Title>Settings</OCard.Title>
    </OCard.Header>
    <OCard.Content>
      <p class="text-sm text-ousi-muted">Update your preferences below.</p>
    </OCard.Content>
    <OCard.Footer>
      <OButton variant="outline">Cancel</OButton>
      <OButton>Save</OButton>
    </OCard.Footer>
  </OCard>
</template>
