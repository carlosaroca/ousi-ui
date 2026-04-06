<script setup lang="ts">
import { OProgressCircle } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex items-center gap-4">
    <OProgressCircle size="sm" />
    <OProgressCircle size="md" />
    <OProgressCircle size="lg" />
    <OProgressCircle size="lg" color="success" />
    <OProgressCircle size="lg" color="danger" />
  </div>
</template>
