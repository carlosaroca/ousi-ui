<script setup lang="ts">
import { ORadio, ORadioGroup } from '@ousi-ui/vue'
</script>
<template>
  <ORadioGroup orientation="horizontal" label="Size" default-value="md">
    <ORadio value="sm" label="Small" />
    <ORadio value="md" label="Medium" />
    <ORadio value="lg" label="Large" />
  </ORadioGroup>
</template>
