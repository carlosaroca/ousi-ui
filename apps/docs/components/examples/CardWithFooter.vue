<script setup lang="ts">
import { OCard, OCardHeader, OCardTitle, OCardContent, OCardFooter, OButton } from '@ousi-ui/vue'
</script>
<template>
  <OCard>
    <OCardHeader>
      <OCardTitle>Settings</OCardTitle>
    </OCardHeader>
    <OCardContent>
      <p class="text-sm text-ousi-muted">Update your preferences below.</p>
    </OCardContent>
    <OCardFooter>
      <OButton variant="outline">Cancel</OButton>
      <OButton>Save</OButton>
    </OCardFooter>
  </OCard>
</template>
