<script setup lang="ts">
import { OTreeView } from '@ousi-ui/vue'
import type { TreeNode } from '@ousi-ui/vue'

// node.icon takes an SVG path 'd' attribute. Common Lucide-style paths below.
const folder = 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'
const file   = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6'
const code   = 'M16 18l6-6-6-6 M8 6l-6 6 6 6'

const nodes: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    icon: folder,
    children: [
      {
        key: 'components',
        label: 'components',
        icon: folder,
        children: [
          { key: 'btn', label: 'Button.vue', icon: code },
          { key: 'inp', label: 'Input.vue',  icon: code },
        ],
      },
      { key: 'index.ts', label: 'index.ts', icon: file },
      { key: 'main.ts',  label: 'main.ts',  icon: file },
    ],
  },
  { key: 'pkg', label: 'package.json', icon: file },
  { key: 'rdm', label: 'README.md',    icon: file },
]
</script>

<template>
  <OTreeView :nodes="nodes" :default-expanded-keys="new Set(['src', 'components'])" />
</template>
