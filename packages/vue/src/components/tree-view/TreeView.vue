<script setup lang="ts">
import { computed, ref, toRef, useSlots, provide, nextTick } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import type { TreeViewProps, TreeViewEmits, TreeNode } from './tree-view.types'
import { treeViewTheme } from './tree-view.theme'
import TreeViewNode from './TreeViewNode.vue'

const props = withDefaults(defineProps<TreeViewProps>(), {
  selectionMode: 'none',
  expandOnLabelClick: false,
})

// ── Lazy loading state ──
const loadedChildren = ref<Map<string, TreeNode[]>>(new Map())
const loadingKeys = ref<Set<string>>(new Set())
const errorKeys = ref<Set<string>>(new Set())

function effectiveChildren(node: TreeNode): TreeNode[] | undefined {
  if (node.children) return node.children
  return loadedChildren.value.get(node.key)
}

function hasOrCanHaveChildren(node: TreeNode): boolean {
  return !!node.children?.length || !!node.isAsync || !!loadedChildren.value.get(node.key)?.length
}

async function loadNode(node: TreeNode) {
  if (!props.loadChildren) return
  loadingKeys.value = new Set([...loadingKeys.value, node.key])
  const nextErrors = new Set(errorKeys.value)
  nextErrors.delete(node.key)
  errorKeys.value = nextErrors
  try {
    const children = await props.loadChildren(node)
    const nextMap = new Map(loadedChildren.value)
    nextMap.set(node.key, children)
    loadedChildren.value = nextMap
  } catch {
    errorKeys.value = new Set([...errorKeys.value, node.key])
  } finally {
    const next = new Set(loadingKeys.value)
    next.delete(node.key)
    loadingKeys.value = next
  }
}

function findNodeByKey(key: string, nodes: TreeNode[]): TreeNode | undefined {
  for (const n of nodes) {
    if (n.key === key) return n
    if (n.children?.length) {
      const found = findNodeByKey(key, n.children)
      if (found) return found
    }
    const loaded = loadedChildren.value.get(n.key)
    if (loaded?.length) {
      const found = findNodeByKey(key, loaded)
      if (found) return found
    }
  }
  return undefined
}

/** Clear cached children for a node and re-fetch. */
async function reload(key: string) {
  const node = findNodeByKey(key, props.nodes)
  if (!node) return
  const nextMap = new Map(loadedChildren.value)
  nextMap.delete(key)
  loadedChildren.value = nextMap
  await loadNode(node)
}

const emit = defineEmits<TreeViewEmits>()
const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)

// ── Expansion state (controllable) ──
const expandedKeys = useControllableState<Set<string>>({
  prop: toRef(props, 'expandedKeys') as any,
  defaultValue: props.defaultExpandedKeys ?? new Set<string>(),
  onChange: (val) => emit('update:expandedKeys', val),
})

function isExpanded(key: string): boolean {
  return expandedKeys.value.has(key)
}

function maybeLoadOnExpand(key: string) {
  // Fire-and-forget: if the node is async and not yet loaded, kick off the fetch.
  // The expanded state is set immediately; children render once the promise resolves.
  const node = findNodeByKey(key, props.nodes)
  if (!node || !node.isAsync) return
  if (loadedChildren.value.has(key)) return // already cached
  if (loadingKeys.value.has(key)) return    // already loading
  void loadNode(node)
}

function toggleNode(key: string) {
  const next = new Set(expandedKeys.value)
  if (next.has(key)) {
    next.delete(key)
    expandedKeys.value = next
    emit('collapse', key)
  } else {
    next.add(key)
    expandedKeys.value = next
    emit('expand', key)
    maybeLoadOnExpand(key)
  }
}

function expand(key: string) {
  if (expandedKeys.value.has(key)) return
  const next = new Set(expandedKeys.value)
  next.add(key)
  expandedKeys.value = next
  emit('expand', key)
  maybeLoadOnExpand(key)
}

function collapse(key: string) {
  if (!expandedKeys.value.has(key)) return
  const next = new Set(expandedKeys.value)
  next.delete(key)
  expandedKeys.value = next
  emit('collapse', key)
}

function allExpandableKeys(): string[] {
  const keys: string[] = []
  function walk(nodes: TreeNode[]) {
    for (const n of nodes) {
      if (hasOrCanHaveChildren(n)) {
        keys.push(n.key)
        const children = effectiveChildren(n)
        if (children?.length) walk(children)
      }
    }
  }
  walk(props.nodes)
  return keys
}

function expandAll() {
  expandedKeys.value = new Set(allExpandableKeys())
}
function collapseAll() {
  expandedKeys.value = new Set()
}

// ── Single-select state (controllable) ──
const selectedKey = useControllableState<string>({
  prop: toRef(props, 'selectedKey') as any,
  defaultValue: props.defaultSelectedKey ?? '',
  onChange: (val) => emit('update:selectedKey', val),
})

// ── Multi-select state (controllable) ──
const selectedKeys = useControllableState<Set<string>>({
  prop: toRef(props, 'selectedKeys') as any,
  defaultValue: props.defaultSelectedKeys ?? new Set<string>(),
  onChange: (val) => emit('update:selectedKeys', val),
})

function isSelected(key: string): boolean {
  if (props.selectionMode === 'single') return selectedKey.value === key
  if (props.selectionMode === 'multiple') return selectedKeys.value.has(key)
  return false
}

function selectNode(key: string, node: TreeNode) {
  if (props.selectionMode === 'none') return
  if (props.selectionMode === 'single') {
    selectedKey.value = key
  } else {
    const next = new Set(selectedKeys.value)
    next.has(key) ? next.delete(key) : next.add(key)
    selectedKeys.value = next
  }
  emit('select', key, node)
}

// ── Flat list of currently visible nodes for keyboard navigation ──
interface VisibleEntry {
  node: TreeNode
  level: number
  parentKey: string | null
}

const visibleNodes = computed<VisibleEntry[]>(() => {
  const flat: VisibleEntry[] = []
  function walk(nodes: TreeNode[], level: number, parentKey: string | null) {
    for (const n of nodes) {
      flat.push({ node: n, level, parentKey })
      // Walk into children when expanded — include async-loaded children once they arrive.
      const children = effectiveChildren(n)
      if (children?.length && expandedKeys.value.has(n.key)) {
        walk(children, level + 1, n.key)
      }
    }
  }
  walk(props.nodes, 1, null)
  return flat
})

// Tree-wide "active" key — gets tabindex=0 via roving tabindex pattern.
const focusedKey = ref<string>('')

function ensureFocus() {
  if (focusedKey.value) return
  const first = visibleNodes.value.find((v) => !v.node.disabled)
  if (first) focusedKey.value = first.node.key
}

function focusKey(key: string) {
  focusedKey.value = key
  nextTick(() => {
    const el = rootRef.value?.querySelector<HTMLElement>(`[data-tree-key="${CSS.escape(key)}"]`)
    el?.focus()
  })
}

function indexOf(key: string): number {
  return visibleNodes.value.findIndex((v) => v.node.key === key)
}

function findParent(key: string): string | null {
  const idx = indexOf(key)
  if (idx < 0) return null
  return visibleNodes.value[idx].parentKey
}

function focusNext(key: string) {
  const list = visibleNodes.value
  const idx = indexOf(key)
  for (let i = idx + 1; i < list.length; i++) {
    if (!list[i].node.disabled) {
      focusKey(list[i].node.key)
      return
    }
  }
}
function focusPrev(key: string) {
  const list = visibleNodes.value
  const idx = indexOf(key)
  for (let i = idx - 1; i >= 0; i--) {
    if (!list[i].node.disabled) {
      focusKey(list[i].node.key)
      return
    }
  }
}
function focusFirst() {
  const first = visibleNodes.value.find((v) => !v.node.disabled)
  if (first) focusKey(first.node.key)
}
function focusLast() {
  for (let i = visibleNodes.value.length - 1; i >= 0; i--) {
    if (!visibleNodes.value[i].node.disabled) {
      focusKey(visibleNodes.value[i].node.key)
      return
    }
  }
}

function findChildrenOf(parentKey: string, nodes: TreeNode[]): TreeNode[] {
  for (const n of nodes) {
    if (n.key === parentKey) return effectiveChildren(n) ?? []
    const children = effectiveChildren(n)
    if (children?.length) {
      const found = findChildrenOf(parentKey, children)
      if (found.length) return found
    }
  }
  return []
}

function handleKeydown(e: KeyboardEvent, node: TreeNode) {
  if (node.disabled) return
  const key = node.key
  const hasChildren = hasOrCanHaveChildren(node)

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusNext(key)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusPrev(key)
      break
    case 'ArrowRight':
      e.preventDefault()
      if (hasChildren && !isExpanded(key)) {
        expand(key)
      } else if (hasChildren && isExpanded(key)) {
        // Focus first child
        const idx = indexOf(key)
        const next = visibleNodes.value[idx + 1]
        if (next && next.parentKey === key) focusKey(next.node.key)
      }
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (hasChildren && isExpanded(key)) {
        collapse(key)
      } else {
        const parent = findParent(key)
        if (parent) focusKey(parent)
      }
      break
    case 'Home':
      e.preventDefault()
      focusFirst()
      break
    case 'End':
      e.preventDefault()
      focusLast()
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (props.selectionMode !== 'none') selectNode(key, node)
      else if (hasChildren) toggleNode(key)
      break
    case '*': {
      // Expand all siblings at the same level as the focused node.
      e.preventDefault()
      const idx = indexOf(key)
      const parentKey = visibleNodes.value[idx]?.parentKey ?? null
      const siblings = parentKey
        ? findChildrenOf(parentKey, props.nodes)
        : props.nodes
      const next = new Set(expandedKeys.value)
      for (const s of siblings) {
        if (s.children?.length) next.add(s.key)
      }
      expandedKeys.value = next
      break
    }
  }
}

// When the root receives focus (Tab into the tree), move focus onto the active treeitem.
function handleFocusIn(e: FocusEvent) {
  if (e.target === rootRef.value) {
    ensureFocus()
    if (focusedKey.value) {
      nextTick(() => {
        const el = rootRef.value?.querySelector<HTMLElement>(
          `[data-tree-key="${CSS.escape(focusedKey.value)}"]`,
        )
        el?.focus()
      })
    }
  }
}

// Provide context to child nodes.
provide('tree-is-selected', isSelected)
provide('tree-selection-mode', computed(() => props.selectionMode))
provide('tree-is-expanded', isExpanded)
provide('tree-toggle', toggleNode)
provide('tree-select', selectNode)
provide('tree-focused-key', focusedKey)
provide('tree-keydown', handleKeydown)
provide('tree-expand-on-label-click', computed(() => props.expandOnLabelClick))
provide('tree-slots', slots)
// Lazy loading state — TreeViewNode reads these to render spinner / retry.
provide('tree-effective-children', effectiveChildren)
provide('tree-has-children', hasOrCanHaveChildren)
provide('tree-loading-keys', loadingKeys)
provide('tree-error-keys', errorKeys)
provide('tree-reload', reload)

// Public methods accessible via template ref.
defineExpose({
  expand,
  collapse,
  expandAll,
  collapseAll,
  focusKey,
  reload,
  expandedKeys,
  selectedKey,
  selectedKeys,
})
</script>

<template>
  <div
    ref="rootRef"
    role="tree"
    :aria-multiselectable="selectionMode === 'multiple' || undefined"
    :tabindex="focusedKey ? -1 : 0"
    :class="cn(treeViewTheme, props.class)"
    @focusin="handleFocusIn"
  >
    <TreeViewNode
      v-for="(node, i) in nodes"
      :key="node.key"
      :node="node"
      :level="1"
      :pos-in-set="i + 1"
      :set-size="nodes.length"
    />
  </div>
</template>
