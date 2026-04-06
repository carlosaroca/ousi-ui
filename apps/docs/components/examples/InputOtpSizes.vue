<script setup lang="ts">
import { OInputOtp } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-6">
    <OInputOtp size="sm" label="Small" />
    <OInputOtp size="md" label="Medium" />
    <OInputOtp size="lg" label="Large" />
  </div>
</template>
