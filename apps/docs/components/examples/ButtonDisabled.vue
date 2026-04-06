<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex gap-3">
    <OButton disabled>Disabled</OButton>
    <OButton variant="secondary" disabled>Disabled</OButton>
    <OButton variant="outline" disabled>Disabled</OButton>
  </div>
</template>
