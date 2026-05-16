import type { ComponentData } from './types'

export const treeViewData: ComponentData = {
  title: 'TreeView',
  description: 'A hierarchical tree structure for displaying nested data — with full keyboard nav, ARIA roles, single and multi selection.',
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
  selection-mode="single"
  v-model:selected-key="selected"
  :default-expanded-keys="new Set(['src', 'components'])"
/>`,
      },
    },
    {
      id: 'lazy-loading',
      title: 'Lazy loading (async children)',
      example: {
        component: 'TreeViewLazy',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OTreeView } from '@ousi-ui/vue'
import type { TreeNode } from '@ousi-ui/vue'

// Mark async nodes with isAsync: true. Children are fetched on expand.
const nodes: TreeNode[] = [
  { key: '/projects', label: 'projects', isAsync: true },
  { key: '/docs',     label: 'docs',     isAsync: true },
]

async function loadChildren(node: TreeNode): Promise<TreeNode[]> {
  const res = await fetch(\`/api/files?path=\${node.key}\`)
  return res.json()
}
&lt;/script&gt;

<template>
  <OTreeView :nodes="nodes" :load-children="loadChildren" />
</template>`,
      },
    },
    {
      id: 'icons',
      title: 'With icons',
      example: {
        component: 'TreeViewIcons',
        code: `<!-- node.icon takes an SVG path 'd' attribute, or use the #icon slot for full control. -->
<OTreeView :nodes="nodes" :default-expanded-keys="new Set(['src'])" />`,
      },
    },
    {
      id: 'multi-select',
      title: 'Multi-select',
      example: {
        component: 'TreeViewMultiSelect',
        code: `<OTreeView
  :nodes="nodes"
  selection-mode="multiple"
  v-model:selected-keys="selected"
/>`,
      },
    },
    {
      id: 'selectable',
      title: 'Single-select with status',
      example: {
        component: 'TreeViewSelectable',
        code: `<script setup lang="ts">
import { ref } from 'vue'
const selected = ref('')
&lt;/script&gt;

<OTreeView
  :nodes="nodes"
  selection-mode="single"
  v-model:selected-key="selected"
/>`,
      },
    },
    {
      id: 'expanded',
      title: 'Default expanded',
      example: {
        component: 'TreeViewExpanded',
        code: `<OTreeView :nodes="nodes" :default-expanded-keys="new Set(['docs', 'guides'])" />`,
      },
    },
    {
      id: 'custom-content',
      title: 'Custom node content',
      example: {
        component: 'TreeViewCustomContent',
        code: `<OTreeView :nodes="nodes">
  <template #node="{ node, hasChildren }">
    <span class="flex items-center gap-2">
      <span>{{ hasChildren ? '📁' : '📄' }}</span>
      <span>{{ node.label }}</span>
    </span>
  </template>
</OTreeView>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled nodes',
      example: {
        component: 'TreeViewDisabled',
        code: `<OTreeView :nodes="nodes" selection-mode="single" />`,
      },
    },
  ],

  props: [
    { name: 'nodes', type: 'TreeNode[]', description: 'Array of root tree nodes. Each can have a `children` array for nesting.' },
    { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: "Selection mode. 'multiple' renders a checkbox per node." },
    { name: 'selectedKey', type: 'string', description: 'Controlled single-select. Pair with v-model:selectedKey.' },
    { name: 'defaultSelectedKey', type: 'string', description: 'Default selected key (uncontrolled, single-select).' },
    { name: 'selectedKeys', type: 'Set<string>', description: 'Controlled multi-select. Pair with v-model:selectedKeys.' },
    { name: 'defaultSelectedKeys', type: 'Set<string>', description: 'Default selected keys (uncontrolled, multi-select).' },
    { name: 'expandedKeys', type: 'Set<string>', description: 'Controlled set of expanded node keys. Pair with v-model:expandedKeys.' },
    { name: 'defaultExpandedKeys', type: 'Set<string>', description: 'Default set of expanded keys (uncontrolled).' },
    { name: 'expandOnLabelClick', type: 'boolean', default: 'false', description: 'When true, clicking the row also toggles expansion (not just the chevron). When selectionMode is none, the row already toggles regardless of this flag.' },
    { name: 'loadChildren', type: '(node: TreeNode) => Promise<TreeNode[]>', description: 'Async loader. Called the first time a node with isAsync:true is expanded. Results are cached until reload(key) is called. Throw/reject to render a retry icon.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes on the root.' },
  ],

  slots: [
    { name: 'node', type: 'slot', description: 'Custom node content. Receives { node, isExpanded, isSelected, hasChildren }.' },
    { name: 'icon', type: 'slot', description: 'Custom icon rendering. Receives { node, isExpanded }. Defaults to an SVG using node.icon as a path "d" attribute.' },
    { name: 'chevron', type: 'slot', description: 'Custom chevron / loading / error icon. Receives { isExpanded, isLoading, isError, toggle, retry }.' },
  ],

  emits: [
    { name: 'select', type: '(key: string, node: TreeNode) => void', description: 'Fired when a node is selected.' },
    { name: 'expand', type: '(key: string) => void', description: 'Fired when a node is expanded.' },
    { name: 'collapse', type: '(key: string) => void', description: 'Fired when a node is collapsed.' },
    { name: 'update:selectedKey', type: '(key: string) => void', description: 'For v-model:selectedKey.' },
    { name: 'update:selectedKeys', type: '(keys: Set<string>) => void', description: 'For v-model:selectedKeys.' },
    { name: 'update:expandedKeys', type: '(keys: Set<string>) => void', description: 'For v-model:expandedKeys.' },
  ],

  methods: [
    { name: 'expand', type: '(key: string) => void', description: 'Expand a node.' },
    { name: 'collapse', type: '(key: string) => void', description: 'Collapse a node.' },
    { name: 'expandAll', type: '() => void', description: 'Expand every parent node.' },
    { name: 'collapseAll', type: '() => void', description: 'Collapse every node.' },
    { name: 'focusKey', type: '(key: string) => void', description: 'Move keyboard focus to the given node.' },
    { name: 'reload', type: '(key: string) => Promise<void>', description: 'Clear the cached async children for a node and re-fetch via loadChildren.' },
    { name: 'expandedKeys', type: 'Ref<Set<string>>', description: 'Reactive ref to the current expanded set.' },
    { name: 'selectedKey', type: 'Ref<string>', description: 'Reactive ref to the current single-select key.' },
    { name: 'selectedKeys', type: 'Ref<Set<string>>', description: 'Reactive ref to the current multi-select set.' },
  ],

  keyboard: [
    { key: 'arrow-down / arrow-up', description: 'Move focus to the next / previous visible node.' },
    { key: 'arrow-right', description: 'Expand a collapsed parent. If already expanded, focus the first child.' },
    { key: 'arrow-left', description: 'Collapse an expanded parent. If already collapsed or a leaf, focus the parent.' },
    { key: 'home / end', description: 'Move focus to the first / last visible node.' },
    { key: 'enter / space', description: 'Activate the focused node — select it, or toggle expansion if selection is off.' },
    { key: '*', description: 'Expand every sibling at the same level as the focused node.' },
  ],

  aria: [
    { attribute: 'role="tree"', condition: 'always', description: 'Container has the tree role.' },
    { attribute: 'aria-multiselectable', condition: "selectionMode === 'multiple'", description: 'Marks the tree as multi-selectable.' },
    { attribute: 'role="treeitem"', condition: 'each node', description: 'Each node has the treeitem role.' },
    { attribute: 'aria-expanded', condition: 'nodes with children', description: 'Reflects whether the node is expanded.' },
    { attribute: 'aria-selected', condition: 'selectionMode is not none', description: 'Reflects selection state.' },
    { attribute: 'aria-level / aria-setsize / aria-posinset', condition: 'always', description: 'Communicates depth and position for screen readers.' },
    { attribute: 'role="group"', condition: 'children container', description: 'Groups child nodes per the WAI-ARIA tree pattern.' },
  ],

  bestPractices: [
    { text: 'Use meaningful keys — they are visible to screen readers via aria attributes and used for focus/selection state.', good: true },
    { text: 'Expand commonly-used branches by default to improve discoverability.', good: true },
    { text: 'Keep nesting shallow when possible — add search or filtering past 3 levels.', good: false },
    { text: "Don't put long labels in a TreeView — they truncate. Consider a separate detail pane.", good: false },
  ],
}
