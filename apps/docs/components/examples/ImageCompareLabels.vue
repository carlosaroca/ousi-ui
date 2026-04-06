<script setup lang="ts">
import { OImageCompare } from '@ousi-ui/vue'
</script>
<template>
  <OImageCompare
    before-src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    after-src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80"
    before-label="Original"
    after-label="Enhanced"
    class="max-w-lg"
  />
</template>
