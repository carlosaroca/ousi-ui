<script setup lang="ts">
import { OCard } from '@ousi-ui/vue'
</script>
<template>
  <OCard class="overflow-hidden max-w-sm">
    <img src="https://picsum.photos/400/200" alt="Cover" class="w-full h-48 object-cover" />
    <OCard.Header>
      <OCard.Title>Featured</OCard.Title>
      <OCard.Description>A card with a cover image.</OCard.Description>
    </OCard.Header>
  </OCard>
</template>
