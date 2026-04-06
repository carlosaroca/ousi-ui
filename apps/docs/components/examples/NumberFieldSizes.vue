<script setup lang="ts">
import { ONumberField } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4">
    <ONumberField size="sm" label="Small" :default-value="5" />
    <ONumberField size="md" label="Medium" :default-value="5" />
    <ONumberField size="lg" label="Large" :default-value="5" />
  </div>
</template>
