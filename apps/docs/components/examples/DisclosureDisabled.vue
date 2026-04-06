<script setup lang="ts">
import { ODisclosure } from '@ousi-ui/vue'
</script>
<template>
  <ODisclosure disabled class="border-b border-ousi-border">
    <template #title>Disabled disclosure</template>
    <p class="text-sm text-ousi-muted">Cannot be opened.</p>
  </ODisclosure>
</template>
