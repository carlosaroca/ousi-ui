<script setup lang="ts">
import { h } from 'vue'
import { OContextMenu } from '@ousi-ui/vue'
import type { ContextMenuItem } from '@ousi-ui/vue'

// Inline SVG components — replace with any icon library (Hugeicons, Lucide, Iconify, etc.)
const CopyIcon = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('rect', { x: 9, y: 9, width: 13, height: 13, rx: 2 }),
    h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
  ])

const ShareIcon = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('circle', { cx: 18, cy: 5, r: 3 }),
    h('circle', { cx: 6, cy: 12, r: 3 }),
    h('circle', { cx: 18, cy: 19, r: 3 }),
    h('line', { x1: '8.59', y1: '13.51', x2: '15.42', y2: '17.49' }),
    h('line', { x1: '15.41', y1: '6.51', x2: '8.59', y2: '10.49' }),
  ])

const TrashIcon = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('polyline', { points: '3 6 5 6 21 6' }),
    h('path', { d: 'M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6' }),
    h('path', { d: 'M10 11v6M14 11v6' }),
  ])

const items: ContextMenuItem[] = [
  { key: 'copy', label: 'Copy', icon: CopyIcon, shortcut: '⌘C' },
  { key: 'share', label: 'Share', icon: ShareIcon },
  { separator: true },
  { key: 'delete', label: 'Delete', icon: TrashIcon, danger: true },
]
</script>
<template>
  <OContextMenu :items="items">
    <div class="flex items-center justify-center p-12 border border-dashed border-ousi-border rounded-ousi-xl text-sm text-ousi-muted">
      Right-click — custom icons
    </div>
  </OContextMenu>
</template>
