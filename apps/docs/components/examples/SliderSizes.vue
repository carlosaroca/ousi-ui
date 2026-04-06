<script setup lang="ts">
import { OSlider } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-6">
    <OSlider size="sm" :default-value="30" label="Small" />
    <OSlider size="md" :default-value="50" label="Medium" />
    <OSlider size="lg" :default-value="70" label="Large" />
  </div>
</template>
