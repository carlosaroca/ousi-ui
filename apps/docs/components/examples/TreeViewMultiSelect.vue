<script setup lang="ts">
import { ref } from 'vue'
import { OTreeView, OChip } from '@ousi-ui/vue'
import type { TreeNode } from '@ousi-ui/vue'

const selected = ref<Set<string>>(new Set(['button', 'card']))

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
          { key: 'input',  label: 'Input.vue' },
          { key: 'card',   label: 'Card.vue' },
          { key: 'dialog', label: 'Dialog.vue' },
        ],
      },
      { key: 'App.vue', label: 'App.vue' },
      { key: 'main.ts', label: 'main.ts' },
    ],
  },
]
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center gap-1.5">
      <span class="text-xs text-ousi-muted">Selected:</span>
      <OChip v-if="selected.size === 0" variant="soft" size="sm">none</OChip>
      <OChip v-for="key in selected" :key="key" variant="soft" color="accent" size="sm">{{ key }}</OChip>
    </div>
    <OTreeView
      :nodes="nodes"
      selection-mode="multiple"
      v-model:selected-keys="selected"
      :default-expanded-keys="new Set(['src', 'components'])"
    />
  </div>
</template>
