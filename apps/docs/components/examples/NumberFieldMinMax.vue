<script setup lang="ts">
import { ONumberField } from '@ousi-ui/vue'
</script>
<template>
  <ONumberField label="Rating" :min="1" :max="5" :default-value="3" />
</template>
