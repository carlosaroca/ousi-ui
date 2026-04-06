<script setup lang="ts">
import { OAlert } from '@ousi-ui/vue'
</script>
<template>
  <div class="space-y-3">
    <OAlert variant="default" title="Default alert" />
    <OAlert variant="accent" title="Accent alert" />
    <OAlert variant="success" title="Success alert" />
    <OAlert variant="warning" title="Warning alert" />
    <OAlert variant="danger" title="Danger alert" />
  </div>
</template>
