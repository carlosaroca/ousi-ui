<script setup lang="ts">
import { OTreeView } from '@ousi-ui/vue'
import type { TreeNode } from '@ousi-ui/vue'

const nodes: TreeNode[] = [
  {
    key: 'docs',
    label: 'Documentation',
    children: [
      { key: 'intro', label: 'Introduction' },
      {
        key: 'guides',
        label: 'Guides',
        children: [
          { key: 'quick-start', label: 'Quick Start' },
          { key: 'theming', label: 'Theming' },
          { key: 'styling', label: 'Custom Styling' },
        ],
      },
    ],
  },
  {
    key: 'api',
    label: 'API Reference',
    children: [
      { key: 'components', label: 'Components' },
      { key: 'composables', label: 'Composables' },
      { key: 'utils', label: 'Utilities' },
    ],
  },
]
</script>

<template>
  <div class="w-full max-w-sm rounded-ousi-xl border border-ousi-border bg-ousi-surface p-3">
    <OTreeView :nodes="nodes" :default-expanded-keys="new Set(['docs', 'guides', 'api'])" />
  </div>
</template>
