<script setup lang="ts">
import { OInput } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <OInput label="Default (static)" placeholder="No animation on focus" />
    <OInput label="Animated" placeholder="Scales on focus" animated />
  </div>
</template>
