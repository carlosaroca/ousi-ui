<script setup lang="ts">
import { OProgressCircle } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-6">
    <OProgressCircle :value="75" color="default" />
    <OProgressCircle :value="75" color="accent" />
    <OProgressCircle :value="75" color="success" />
    <OProgressCircle :value="75" color="warning" />
    <OProgressCircle :value="75" color="danger" />
  </div>
</template>
