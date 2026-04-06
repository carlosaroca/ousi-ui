<script setup lang="ts">
import { OTooltip, OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex gap-3">
    <OTooltip content="Delayed tooltip" :delay="500">
      <OButton variant="outline">Slow open (500ms)</OButton>
    </OTooltip>
    <OTooltip content="Slow to close" :close-delay="1000">
      <OButton variant="outline">Slow close (1s)</OButton>
    </OTooltip>
  </div>
</template>
