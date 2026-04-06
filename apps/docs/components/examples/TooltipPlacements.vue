<script setup lang="ts">
import { OTooltip, OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OTooltip content="Top" placement="top">
      <OButton variant="outline">Top</OButton>
    </OTooltip>
    <OTooltip content="Right" placement="right">
      <OButton variant="outline">Right</OButton>
    </OTooltip>
    <OTooltip content="Bottom" placement="bottom">
      <OButton variant="outline">Bottom</OButton>
    </OTooltip>
    <OTooltip content="Left" placement="left">
      <OButton variant="outline">Left</OButton>
    </OTooltip>
  </div>
</template>
