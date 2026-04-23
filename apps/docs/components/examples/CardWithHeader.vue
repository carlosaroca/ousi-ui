<script setup lang="ts">
import { OCard, OCardHeader, OCardTitle, OCardDescription, OCardContent } from '@ousi-ui/vue'
</script>
<template>
  <OCard>
    <OCardHeader>
      <OCardTitle>Card Title</OCardTitle>
      <OCardDescription>Card description here.</OCardDescription>
    </OCardHeader>
    <OCardContent>
      <p class="text-sm text-ousi-muted">Card body content goes here.</p>
    </OCardContent>
  </OCard>
</template>
