<script setup lang="ts">
import { ODateField } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <ODateField label="Default (static)" />
    <ODateField label="Animated" animated />
  </div>
</template>
