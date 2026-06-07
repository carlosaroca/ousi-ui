<script setup lang="ts">
import { OContextMenu } from '@ousi-ui/vue'
import type { ContextMenuItem } from '@ousi-ui/vue'

const items: ContextMenuItem[] = [
  { key: 'new', label: 'New' },
  {
    key: 'export',
    label: 'Export as',
    children: [
      { key: 'csv', label: 'CSV' },
      { key: 'xlsx', label: 'Excel' },
      { key: 'pdf', label: 'PDF' },
    ],
  },
  { separator: true },
  { key: 'delete', label: 'Delete', danger: true },
]

const offsets = [0, 4, 16]
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
    <div v-for="o in offsets" :key="o" class="space-y-2">
      <p class="text-xs text-ousi-muted">
        <code class="font-mono">:submenu-offset="{{ o }}"</code>
      </p>
      <OContextMenu :items="items" :submenu-offset="o">
        <div class="flex items-center justify-center p-8 border border-dashed border-ousi-border rounded-ousi-xl text-xs text-ousi-muted">
          Right-click — hover Export
        </div>
      </OContextMenu>
    </div>
  </div>
</template>
