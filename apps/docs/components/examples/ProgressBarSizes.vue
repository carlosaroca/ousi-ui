<script setup lang="ts">
import { OProgressBar } from '@ousi-ui/vue'
</script>
<template>
  <div class="space-y-3">
    <OProgressBar :value="60" size="sm" />
    <OProgressBar :value="60" size="md" />
    <OProgressBar :value="60" size="lg" />
  </div>
</template>
