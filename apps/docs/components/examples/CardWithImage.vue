<script setup lang="ts">
import { OCard, OCardHeader, OCardTitle, OCardDescription } from '@ousi-ui/vue'
</script>
<template>
  <OCard class="overflow-hidden max-w-sm">
    <img src="https://picsum.photos/400/200" alt="Cover" class="w-full h-48 object-cover" />
    <OCardHeader>
      <OCardTitle>Featured</OCardTitle>
      <OCardDescription>A card with a cover image.</OCardDescription>
    </OCardHeader>
  </OCard>
</template>
