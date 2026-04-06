<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col gap-4 w-full max-w-md">
    <div class="flex flex-col gap-1">
      <span class="text-xs text-ousi-muted">20 bars</span>
      <OElasticSlider :bar-count="20" :default-value="50" />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs text-ousi-muted">60 bars</span>
      <OElasticSlider :bar-count="60" :default-value="50" />
    </div>
  </div>
</template>
