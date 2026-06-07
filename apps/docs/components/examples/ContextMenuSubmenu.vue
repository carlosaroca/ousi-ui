<script setup lang="ts">
import { ref } from 'vue'
import { OContextMenu } from '@ousi-ui/vue'
import type { ContextMenuItem } from '@ousi-ui/vue'

const lastAction = ref('')

const items: ContextMenuItem[] = [
  { key: 'new', label: 'New', shortcut: '⌘N' },
  { key: 'open', label: 'Open…', shortcut: '⌘O' },
  { separator: true },
  {
    key: 'share',
    label: 'Share',
    children: [
      { key: 'share-link', label: 'Copy link', shortcut: '⌘L' },
      { key: 'share-mail', label: 'Email…' },
      { key: 'share-slack', label: 'Slack' },
      { separator: true },
      {
        key: 'share-more',
        label: 'More…',
        children: [
          { key: 'share-airdrop', label: 'AirDrop' },
          { key: 'share-bluetooth', label: 'Bluetooth' },
        ],
      },
    ],
  },
  {
    key: 'export',
    label: 'Export as',
    children: [
      { key: 'csv', label: 'CSV', shortcut: '⌘E' },
      { key: 'xlsx', label: 'Excel' },
      { key: 'pdf', label: 'PDF' },
    ],
  },
  { separator: true },
  { key: 'delete', label: 'Delete', danger: true, shortcut: '⌫' },
]

function onSelect(key: string) {
  lastAction.value = key
}
</script>
<template>
  <div class="space-y-3">
    <OContextMenu :items="items" @select="onSelect">
      <div class="flex items-center justify-center p-12 border border-dashed border-ousi-border rounded-ousi-xl text-sm text-ousi-muted">
        Right-click — try the submenus
      </div>
    </OContextMenu>
    <p v-if="lastAction" class="text-xs text-ousi-muted">
      Selected: <code class="font-mono">{{ lastAction }}</code>
    </p>
  </div>
</template>
