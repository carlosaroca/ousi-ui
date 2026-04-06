<script setup lang="ts">
import { OProgressCircle } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap items-center gap-6">
    <OProgressCircle :value="75" size="sm" />
    <OProgressCircle :value="75" size="md" />
    <OProgressCircle :value="75" size="lg" />
  </div>
</template>
