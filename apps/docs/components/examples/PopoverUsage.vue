<script setup lang="ts">
import { OPopover, OButton } from '@ousi-ui/vue'
</script>
<template>
  <OPopover title="Help">
    <template #trigger>
      <OButton variant="outline">Open Popover</OButton>
    </template>
    <p class="text-sm">This is the popover content.</p>
  </OPopover>
</template>
