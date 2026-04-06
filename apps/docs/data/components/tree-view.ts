import type { ComponentData } from './types'

export const treeViewData: ComponentData = {
  title: 'TreeView',
  description: 'A hierarchical tree structure for displaying nested data.',
  category: 'Navigation',
  importCode: "import { OTreeView } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TreeViewBasic',
        code: `<OTreeView
  :nodes="nodes"
  :default-expanded="['src', 'components']"
/>`,
      },
    },
    {
      id: 'selectable',
      title: 'Selectable',
      example: {
        component: 'TreeViewSelectable',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const selected = ref('')
</script>

<OTreeView
  :nodes="nodes"
  selectable
  :selected-key="selected"
  :default-expanded="['src', 'components']"
  @select="(key) => selected = key"
/>

<div v-if="selected" class="text-sm text-ousi-muted">
  Selected: <span class="text-ousi-foreground font-medium">{{ selected }}</span>
</div>`,
      },
    },
    {
      id: 'expanded',
      title: 'Default Expanded',
      example: {
        component: 'TreeViewExpanded',
        code: `<OTreeView
  :nodes="nodes"
  :default-expanded="['docs', 'guides', 'api']"
/>`,
      },
    },
    {
      id: 'custom-content',
      title: 'Custom Node Content',
      example: {
        component: 'TreeViewCustomContent',
        code: `<script setup lang="ts">
const nodes = [
  {
    key: 'src',
    label: 'src',
    children: [
      { key: 'index.ts', label: 'index.ts' },
      { key: 'App.vue', label: 'App.vue' },
      { key: 'style.css', label: 'style.css' },
    ],
  },
  { key: 'package.json', label: 'package.json' },
  { key: 'README.md', label: 'README.md' },
]

function getIcon(label: string, hasChildren: boolean): string {
  if (hasChildren) return '📁'
  if (label.endsWith('.vue')) return '💚'
  if (label.endsWith('.ts')) return '🔷'
  if (label.endsWith('.css')) return '🎨'
  return '📄'
}
</script>

<template>
  <OTreeView :nodes="nodes" :default-expanded="['src']">
    <template #node="{ node, hasChildren }">
      <span class="flex items-center gap-2">
        <span>{{ getIcon(node.label, hasChildren) }}</span>
        <span>{{ node.label }}</span>
      </span>
    </template>
  </OTreeView>
</template>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled Nodes',
      example: {
        component: 'TreeViewDisabled',
        code: `<script setup lang="ts">
const nodes = [
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
  <OTreeView :nodes="nodes" :default-expanded="['available']" selectable />
</template>`,
      },
    },
  ],

  props: [
    { name: 'nodes', type: 'TreeNode[]', description: 'Array of tree node objects with key, label, and optional children.' },
    { name: 'defaultExpanded', type: 'string[]', description: 'Keys of nodes that should be expanded by default.' },
    { name: 'selectable', type: 'boolean', default: 'false', description: 'Whether nodes can be selected.' },
    { name: 'selectedKey', type: 'string', description: 'The key of the currently selected node.' },
  ],

  emits: [
    { name: 'select', type: '[key: string]', description: 'Emitted when a node is selected.' },
    { name: 'expand', type: '[key: string]', description: 'Emitted when a node is expanded.' },
    { name: 'collapse', type: '[key: string]', description: 'Emitted when a node is collapsed.' },
  ],

  bestPractices: [
    { text: 'Use meaningful labels that clearly describe each node.', good: true },
    { text: 'Expand commonly used branches by default for better discoverability.', good: true },
    { text: "Don't nest too many levels deep without providing search or filtering.", good: false },
  ],
}
