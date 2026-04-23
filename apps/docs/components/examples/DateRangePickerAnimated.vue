<script setup lang="ts">
import { ODateRangePicker } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <ODateRangePicker label="Default (static)" />
    <ODateRangePicker label="Animated" animated />
  </div>
</template>
