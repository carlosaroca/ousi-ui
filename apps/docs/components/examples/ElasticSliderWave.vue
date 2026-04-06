<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col gap-4 w-full max-w-md">
    <div class="flex flex-col gap-1">
      <span class="text-xs text-ousi-muted">Tight wave (radius: 4, intensity: 1.3)</span>
      <OElasticSlider :wave-radius="4" :wave-intensity="1.3" :default-value="50" />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs text-ousi-muted">Wide wave (radius: 14, intensity: 2.5)</span>
      <OElasticSlider :wave-radius="14" :wave-intensity="2.5" :default-value="50" />
    </div>
  </div>
</template>
