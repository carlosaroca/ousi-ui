<script setup lang="ts">
import { ref } from 'vue'
import { OImageCompare, OSlider } from '@ousi-ui/vue'
const pos = ref(30)
</script>
<template>
  <div class="flex flex-col gap-4 max-w-lg">
    <OImageCompare
      v-model="pos"
      before-src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
      after-src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80"
      before-label="Before"
      after-label="After"
    />
    <OSlider v-model="pos" :min="0" :max="100" label="Position" :show-output="true" />
  </div>
</template>
