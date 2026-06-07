<script setup lang="ts">
import { ref } from 'vue'
import { OContextMenu, OButton } from '@ousi-ui/vue'
import type { ContextMenuItem } from '@ousi-ui/vue'

const menuRef = ref<InstanceType<typeof OContextMenu>>()

const items: ContextMenuItem[] = [
  { key: 'rename', label: 'Rename', shortcut: 'F2' },
  { key: 'duplicate', label: 'Duplicate', shortcut: '⌘D' },
  { key: 'archive', label: 'Archive' },
  { separator: true },
  { key: 'delete', label: 'Delete', danger: true },
]

function openAtButton(e: MouseEvent) {
  const btn = e.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  menuRef.value?.show({ x: rect.left, y: rect.bottom + 4 })
}

function openAtCursor(e: MouseEvent) {
  menuRef.value?.show(e)
}
</script>
<template>
  <div class="flex items-center gap-3">
    <OButton @click="openAtButton">Open menu below</OButton>
    <OButton variant="secondary" @click="openAtCursor">Open at cursor</OButton>

    <!-- The menu has no trigger slot — it only opens programmatically. -->
    <OContextMenu ref="menuRef" :items="items" />
  </div>
</template>
