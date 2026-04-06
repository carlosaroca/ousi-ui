<script setup lang="ts">
import { ONumberField } from '@ousi-ui/vue'
</script>
<template>
  <ONumberField
    label="Age"
    error-message="Age must be at least 18."
    :model-value="15"
  />
</template>
