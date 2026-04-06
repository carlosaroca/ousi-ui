<script setup lang="ts">
import { OPopover, OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OPopover placement="top">
      <template #trigger><OButton variant="outline">Top</OButton></template>
      <p class="text-sm">Placed on top.</p>
    </OPopover>
    <OPopover placement="right">
      <template #trigger><OButton variant="outline">Right</OButton></template>
      <p class="text-sm">Placed on right.</p>
    </OPopover>
    <OPopover placement="bottom">
      <template #trigger><OButton variant="outline">Bottom</OButton></template>
      <p class="text-sm">Placed on bottom.</p>
    </OPopover>
    <OPopover placement="left">
      <template #trigger><OButton variant="outline">Left</OButton></template>
      <p class="text-sm">Placed on left.</p>
    </OPopover>
  </div>
</template>
