<script setup lang="ts">
import { ONumberField } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4">
    <ONumberField variant="primary" label="Primary" :default-value="10" />
    <ONumberField variant="secondary" label="Secondary" :default-value="10" />
  </div>
</template>
