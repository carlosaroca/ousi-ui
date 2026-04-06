<script setup lang="ts">
import { ONumberField } from '@ousi-ui/vue'
</script>
<template>
  <ONumberField
    label="Guests"
    description="Maximum 10 guests allowed."
    :min="1"
    :max="10"
    :default-value="2"
  />
</template>
