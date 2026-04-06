<script setup lang="ts">
import { ORating } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-3">
    <ORating :default-value="3" color="accent" />
    <ORating :default-value="3" color="success" />
    <ORating :default-value="3" color="warning" />
    <ORating :default-value="3" color="danger" />
    <ORating :default-value="3" color="default" />
  </div>
</template>
