<script setup lang="ts">
import { ORadio, ORadioGroup } from '@ousi-ui/vue'
</script>
<template>
  <ORadioGroup label="Options" disabled default-value="a">
    <ORadio value="a" label="Option A" />
    <ORadio value="b" label="Option B" />
  </ORadioGroup>
</template>
