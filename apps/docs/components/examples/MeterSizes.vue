<script setup lang="ts">
import { OMeter } from '@ousi-ui/vue'
</script>
<template>
  <div class="space-y-3">
    <OMeter :value="60" size="sm" label="Small" />
    <OMeter :value="60" size="md" label="Medium" />
    <OMeter :value="60" size="lg" label="Large" />
  </div>
</template>
