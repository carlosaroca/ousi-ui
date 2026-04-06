<script setup lang="ts">
</script>

<template>
  <div class="w-full max-w-lg">
    <OCarousel autoplay :autoplay-interval="3000" :show-arrows="false" :show-dots="false" loop>
      <div class="h-48 rounded-ousi-xl bg-ousi-accent/15 flex items-center justify-center">
        <span class="text-lg font-semibold text-ousi-accent">Slide 1</span>
      </div>
      <div class="h-48 rounded-ousi-xl bg-ousi-success/15 flex items-center justify-center">
        <span class="text-lg font-semibold text-ousi-success">Slide 2</span>
      </div>
      <div class="h-48 rounded-ousi-xl bg-ousi-warning/15 flex items-center justify-center">
        <span class="text-lg font-semibold text-ousi-warning">Slide 3</span>
      </div>
    </OCarousel>
    <p class="text-xs text-ousi-muted text-center mt-2">Auto-advances every 3s, pauses on hover, no arrows or dots</p>
  </div>
</template>
