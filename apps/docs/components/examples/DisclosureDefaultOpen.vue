<script setup lang="ts">
import { ODisclosure } from '@ousi-ui/vue'
</script>
<template>
  <ODisclosure default-open class="border-b border-ousi-border">
    <template #title>Open by default</template>
    <p class="text-sm text-ousi-muted">This disclosure starts expanded.</p>
  </ODisclosure>
</template>
