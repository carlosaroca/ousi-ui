<script setup lang="ts">
import { OMagneticButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex justify-center gap-6 pt-52 pb-8">
    <OMagneticButton
      label="STRONG"
      :magnet-strength="0.8"
      :tilt-max="25"
      popup-src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80"
    />
    <OMagneticButton
      label="SUBTLE"
      :magnet-strength="0.1"
      :tilt-max="5"
      popup-src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80"
    />
  </div>
</template>
