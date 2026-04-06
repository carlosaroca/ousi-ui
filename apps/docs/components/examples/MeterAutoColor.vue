<script setup lang="ts">
import { OMeter } from '@ousi-ui/vue'
</script>
<template>
  <div class="space-y-3">
    <OMeter :value="20" auto-color label="Low" show-value-label />
    <OMeter :value="50" auto-color label="Medium" show-value-label />
    <OMeter :value="90" auto-color label="High" show-value-label />
  </div>
</template>
