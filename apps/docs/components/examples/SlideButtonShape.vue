<script setup lang="ts">
import { OSlideButton } from '@ousi-ui/vue'
</script>
<template>
  <!-- The shape comes from one radius, the button's by default. The thumb stays concentric with
       it, so any value looks right. A theme that changes --ousi-radius changes it too. -->
  <div class="flex w-full max-w-xs flex-col gap-3">
    <OSlideButton label="The theme's radius" full-width />
    <OSlideButton label="Softer corners" full-width class="[--slide-radius:var(--ousi-radius-2xl)]" />
    <OSlideButton label="Square" full-width class="[--slide-radius:0px]" />
    <OSlideButton label="Taller, with a shadow" full-width shadow="md" class="[--slide-h:4rem]" />
  </div>
</template>
