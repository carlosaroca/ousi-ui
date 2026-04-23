<script setup lang="ts">
import { ODatePicker } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <ODatePicker label="Default (static)" />
    <ODatePicker label="Animated" animated />
  </div>
</template>
