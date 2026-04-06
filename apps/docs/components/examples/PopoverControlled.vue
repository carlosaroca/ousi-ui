<script setup lang="ts">
import { ref } from 'vue'
import { OPopover, OButton } from '@ousi-ui/vue'
const popoverRef = ref()
const lastEvent = ref('none')
</script>
<template>
  <div class="flex items-center gap-3">
    <OPopover ref="popoverRef" @open="lastEvent = 'open'" @close="lastEvent = 'close'">
      <template #trigger>
        <OButton variant="outline">Trigger</OButton>
      </template>
      <p class="text-sm">Popover with events.</p>
    </OPopover>
    <span class="text-sm text-ousi-muted-foreground">Last event: {{ lastEvent }}</span>
  </div>
</template>
