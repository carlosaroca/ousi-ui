<script setup lang="ts">
import { OTreeView } from '@ousi-ui/vue'
import type { TreeNode } from '@ousi-ui/vue'

const nodes: TreeNode[] = [
  {
    key: 'available',
    label: 'Available Features',
    children: [
      { key: 'auth', label: 'Authentication' },
      { key: 'dashboard', label: 'Dashboard' },
    ],
  },
  {
    key: 'locked',
    label: 'Premium Features',
    disabled: true,
    children: [
      { key: 'analytics', label: 'Analytics' },
      { key: 'reports', label: 'Reports' },
    ],
  },
]
</script>

<template>
  <div class="w-full max-w-sm rounded-ousi-xl border border-ousi-border bg-ousi-surface p-3">
    <OTreeView :nodes="nodes" selection-mode="single" :default-expanded-keys="new Set(['available'])" />
    <p class="text-xs text-ousi-muted mt-2">"Premium Features" is disabled.</p>
  </div>
</template>
