<script setup lang="ts">
import { OMagneticButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex justify-center gap-6 py-4">
    <OMagneticButton label="HOVER ME" />
    <OMagneticButton label="MAGNETIC" :magnet-strength="0.6" />
  </div>
</template>
