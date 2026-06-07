<script setup lang="ts">
import { OContextMenu } from '@ousi-ui/vue'
import type { ContextMenuItem } from '@ousi-ui/vue'

const items: ContextMenuItem[] = [
  { key: 'edit-heading', label: 'Edit', heading: true },
  { key: 'cut', label: 'Cut', shortcut: '⌘X' },
  { key: 'copy', label: 'Copy', shortcut: '⌘C' },
  { key: 'paste', label: 'Paste', shortcut: '⌘V' },

  { key: 'view-heading', label: 'View', heading: true },
  { key: 'zoom-in', label: 'Zoom in', shortcut: '⌘+' },
  { key: 'zoom-out', label: 'Zoom out', shortcut: '⌘-' },

  { key: 'danger-heading', label: 'Danger zone', heading: true },
  { key: 'delete', label: 'Delete', danger: true, shortcut: '⌫' },
]
</script>
<template>
  <OContextMenu :items="items">
    <div class="flex items-center justify-center p-12 border border-dashed border-ousi-border rounded-ousi-xl text-sm text-ousi-muted">
      Right-click — grouped sections
    </div>
  </OContextMenu>
</template>
