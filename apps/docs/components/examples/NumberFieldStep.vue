<script setup lang="ts">
import { ONumberField } from '@ousi-ui/vue'
</script>
<template>
  <ONumberField
    label="Price"
    :step="0.5"
    :default-value="10"
    :format-options="{ style: 'currency', currency: 'USD' }"
  />
</template>
