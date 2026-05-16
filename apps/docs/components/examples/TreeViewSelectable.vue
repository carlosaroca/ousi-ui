<script setup lang="ts">
import { ref } from 'vue'
import { OTreeView } from '@ousi-ui/vue'
import type { TreeNode } from '@ousi-ui/vue'

const selected = ref<string>('')

const nodes: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    children: [
      {
        key: 'components',
        label: 'components',
        children: [
          { key: 'Button.vue', label: 'Button.vue' },
          { key: 'Input.vue', label: 'Input.vue' },
          { key: 'Card.vue', label: 'Card.vue' },
        ],
      },
      {
        key: 'utils',
        label: 'utils',
        children: [
          { key: 'helpers.ts', label: 'helpers.ts' },
          { key: 'constants.ts', label: 'constants.ts' },
        ],
      },
      { key: 'App.vue', label: 'App.vue' },
      { key: 'main.ts', label: 'main.ts' },
    ],
  },
  {
    key: 'public',
    label: 'public',
    children: [
      { key: 'favicon.ico', label: 'favicon.ico' },
    ],
  },
  { key: 'package.json', label: 'package.json' },
  { key: 'tsconfig.json', label: 'tsconfig.json' },
]
</script>

<template>
  <div class="flex gap-6 w-full max-w-lg">
    <div class="flex-1 rounded-ousi-xl border border-ousi-border bg-ousi-surface p-3">
      <OTreeView
        :nodes="nodes"
        selection-mode="single"
        v-model:selected-key="selected"
        :default-expanded-keys="new Set(['src', 'components'])"
      />
    </div>
    <div v-if="selected" class="text-sm text-ousi-muted shrink-0">
      Selected: <span class="text-ousi-foreground font-medium">{{ selected }}</span>
    </div>
  </div>
</template>
