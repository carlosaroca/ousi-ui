<script setup lang="ts">
import { computed } from 'vue'
import { OTreeView } from '@ousi-ui/vue'
import type { TreeNode } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const nodes: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    children: [
      { key: 'components', label: 'components', children: [{ key: 'button', label: 'Button.vue' }, { key: 'input', label: 'Input.vue' }] },
      { key: 'utils', label: 'utils.ts' },
    ],
  },
  { key: 'public', label: 'public', children: [{ key: 'logo', label: 'logo.svg' }] },
  { key: 'readme', label: 'README.md' },
]

// Always open, so the box is never half empty and never changes height: what moves is the selection,
// as if someone were clicking through the project.
const expanded = new Set(['src', 'components'])
const files = ['button', 'input', 'utils', 'readme']
const selected = computed(() => files[slot(1.2).value % files.length])
</script>

<template>
  <ShowcaseTile title="Files">
    <div class="rounded-2xl bg-ousi-surface p-2">
      <OTreeView :nodes="nodes" selection-mode="single" :selected-key="selected" :expanded-keys="expanded" />
    </div>
  </ShowcaseTile>
</template>
