<script setup lang="ts">
import { ONumberField } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <ONumberField label="Default (static)" :default-value="10" />
    <ONumberField label="Animated" :default-value="10" animated />
  </div>
</template>
