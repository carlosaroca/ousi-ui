<script setup lang="ts">
import { OKbd } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OKbd :keys="['command', 'shift']">P</OKbd>
    <OKbd :keys="['ctrl', 'alt']">Delete</OKbd>
    <OKbd :keys="['command']">S</OKbd>
  </div>
</template>
