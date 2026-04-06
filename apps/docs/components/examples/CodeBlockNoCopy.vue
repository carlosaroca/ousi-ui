<script setup lang="ts">
import { OCodeBlock } from '@ousi-ui/vue'
</script>
<template>
  <OCodeBlock
    code="// This is read-only documentation
const x = 42"
    :show-copy="false"
  />
</template>
