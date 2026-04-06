<script setup lang="ts">
import { OContextMenu } from '@ousi-ui/vue'

const items = [
  { id: 'copy', label: 'Copy', shortcut: '\u2318C' },
  { id: 'paste', label: 'Paste', shortcut: '\u2318V' },
  { id: 'delete', label: 'Delete', variant: 'danger' as const },
]
</script>
<template>
  <OContextMenu :items="items">
    <div class="flex items-center justify-center p-12 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-500">
      Right-click here
    </div>
  </OContextMenu>
</template>
