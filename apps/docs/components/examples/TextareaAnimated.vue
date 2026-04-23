<script setup lang="ts">
import { OTextarea } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <OTextarea label="Default (static)" placeholder="No animation on focus" />
    <OTextarea label="Animated" placeholder="Scales on focus" animated />
  </div>
</template>
