<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col gap-4 w-full max-w-md">
    <div class="flex flex-col gap-1">
      <span class="text-xs text-ousi-muted">Small</span>
      <OElasticSlider size="sm" :default-value="30" />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs text-ousi-muted">Medium</span>
      <OElasticSlider size="md" :default-value="50" />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs text-ousi-muted">Large</span>
      <OElasticSlider size="lg" :default-value="70" />
    </div>
  </div>
</template>
