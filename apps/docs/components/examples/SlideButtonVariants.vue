<script setup lang="ts">
import { OSlideButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex w-full max-w-xs flex-col gap-3">
    <OSlideButton size="sm" label="Slide to accept" full-width />
    <OSlideButton variant="success" label="Slide to start the trip" full-width />
    <OSlideButton variant="danger" size="lg" label="Slide to delete" confirmed-label="Deleted" full-width />
    <OSlideButton label="Not available yet" disabled full-width />
  </div>
</template>
