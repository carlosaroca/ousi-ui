<script setup lang="ts">
import { ref } from 'vue'

const value = ref(50)
</script>

<template>
  <div class="flex flex-col gap-2 w-full max-w-md">
    <OElasticSlider v-model="value" />
    <p class="text-sm text-ousi-muted text-center">Value: {{ value }}</p>
  </div>
</template>
