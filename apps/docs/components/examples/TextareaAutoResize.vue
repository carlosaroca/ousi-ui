<script setup lang="ts">
import { OTextarea } from '@ousi-ui/vue'
</script>
<template>
  <OTextarea
    auto-resize
    :min-rows="2"
    :max-rows="6"
    placeholder="This textarea grows with content..."
  />
</template>
