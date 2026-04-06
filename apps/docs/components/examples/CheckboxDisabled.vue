<script setup lang="ts">
import { OCheckbox } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4">
    <OCheckbox disabled label="Disabled unchecked" />
    <OCheckbox disabled :model-value="true" label="Disabled checked" />
  </div>
</template>
