<script setup lang="ts">
import { OInputOtp } from '@ousi-ui/vue'
</script>
<template>
  <OInputOtp
    :groups="[{ slots: 3 }, { slots: 3 }]"
    label="Grouped code"
  />
</template>
