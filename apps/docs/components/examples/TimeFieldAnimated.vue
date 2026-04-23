<script setup lang="ts">
import { OTimeField } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <OTimeField label="Default (static)" />
    <OTimeField label="Animated" animated />
  </div>
</template>
