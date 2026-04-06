<script setup lang="ts">
import { ORadio, ORadioGroup } from '@ousi-ui/vue'
</script>
<template>
  <ORadioGroup label="Shipping" default-value="standard">
    <ORadio value="standard" label="Standard" description="4-7 business days" />
    <ORadio value="express" label="Express" description="1-3 business days" />
  </ORadioGroup>
</template>
