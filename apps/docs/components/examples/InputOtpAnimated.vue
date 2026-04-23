<script setup lang="ts">
import { OInputOtp } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <OInputOtp label="Default (static)" />
    <OInputOtp label="Animated" animated />
  </div>
</template>
