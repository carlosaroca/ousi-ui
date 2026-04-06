<script setup lang="ts">
import { OProgressBar } from '@ousi-ui/vue'
</script>
<template>
  <div class="space-y-3">
    <OProgressBar :value="60" color="default" />
    <OProgressBar :value="60" color="accent" />
    <OProgressBar :value="60" color="success" />
    <OProgressBar :value="60" color="warning" />
    <OProgressBar :value="60" color="danger" />
  </div>
</template>
