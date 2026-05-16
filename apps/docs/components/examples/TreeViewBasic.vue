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
          { key: 'button', label: 'Button.vue' },
          { key: 'input', label: 'Input.vue' },
        ],
      },
      {
        key: 'utils',
        label: 'utils',
        children: [
          { key: 'helpers', label: 'helpers.ts' },
        ],
      },
    ],
  },
]
</script>
<template>
  <OTreeView
    :nodes="nodes"
    selection-mode="single"
    v-model:selected-key="selected"
    :default-expanded-keys="new Set(['src', 'components'])"
  />
</template>
