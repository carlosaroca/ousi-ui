<script setup lang="ts">
import { OKbd } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OKbd variant="light" keys="command">K</OKbd>
    <OKbd variant="light" :keys="['command', 'shift']">P</OKbd>
  </div>
</template>
