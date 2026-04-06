<script setup lang="ts">
import { OMeter } from '@ousi-ui/vue'
</script>
<template>
  <div class="space-y-3">
    <OMeter :value="60" color="default" label="Default" />
    <OMeter :value="60" color="accent" label="Accent" />
    <OMeter :value="60" color="success" label="Success" />
    <OMeter :value="60" color="warning" label="Warning" />
    <OMeter :value="60" color="danger" label="Danger" />
  </div>
</template>
