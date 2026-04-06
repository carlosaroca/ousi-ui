<script setup lang="ts">
import { OSwitch } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4">
    <OSwitch disabled label="Disabled off" />
    <OSwitch disabled :model-value="true" label="Disabled on" />
  </div>
</template>
