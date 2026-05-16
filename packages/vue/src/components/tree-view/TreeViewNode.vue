<script setup lang="ts">
import { computed, inject, type Ref, type Slots, type ComputedRef } from 'vue'
import { cn } from '@ousi-ui/core'
import { OCheckbox } from '../checkbox'
import type { TreeNode, TreeSelectionMode } from './tree-view.types'
import {
  treeViewNodeTheme,
  treeViewChildrenTheme,
  treeViewChevronTheme,
  treeViewChevronSpacerTheme,
  treeViewIconTheme,
} from './tree-view.theme'

const props = defineProps<{
  node: TreeNode
  level: number
  posInSet: number
  setSize: number
}>()

// Wired up by TreeView via provide().
const isExpanded = inject<(key: string) => boolean>('tree-is-expanded')!
const isSelected = inject<(key: string) => boolean>('tree-is-selected')!
const selectionMode = inject<ComputedRef<TreeSelectionMode>>('tree-selection-mode')!
const toggleNode = inject<(key: string) => void>('tree-toggle')!
const selectNode = inject<(key: string, node: TreeNode) => void>('tree-select')!
const focusedKey = inject<Ref<string>>('tree-focused-key')!
const handleKeydown = inject<(e: KeyboardEvent, node: TreeNode) => void>('tree-keydown')!
const expandOnLabelClick = inject<ComputedRef<boolean>>('tree-expand-on-label-click')!
const treeSlots = inject<Slots>('tree-slots')!
// Lazy loading context.
const effectiveChildren = inject<(node: TreeNode) => TreeNode[] | undefined>('tree-effective-children')!
const hasOrCanHaveChildren = inject<(node: TreeNode) => boolean>('tree-has-children')!
const loadingKeys = inject<Ref<Set<string>>>('tree-loading-keys')!
const errorKeys = inject<Ref<Set<string>>>('tree-error-keys')!
const reload = inject<(key: string) => Promise<void>>('tree-reload')!

const hasChildren = computed(() => hasOrCanHaveChildren(props.node))
const expanded = computed(() => isExpanded(props.node.key))
const selected = computed(() => isSelected(props.node.key))
const isFocused = computed(() => focusedKey.value === props.node.key)
const isLoading = computed(() => loadingKeys.value.has(props.node.key))
const isError = computed(() => errorKeys.value.has(props.node.key))
const renderChildren = computed(() => effectiveChildren(props.node))

// Chevron click toggles expansion WITHOUT selecting.
function handleChevronClick(e: MouseEvent) {
  e.stopPropagation()
  if (props.node.disabled) return
  if (hasChildren.value) toggleNode(props.node.key)
}

// Row click selects (and optionally toggles expansion).
function handleRowClick() {
  if (props.node.disabled) return
  if (selectionMode.value !== 'none') {
    selectNode(props.node.key, props.node)
  }
  if (expandOnLabelClick.value && hasChildren.value) {
    toggleNode(props.node.key)
  } else if (selectionMode.value === 'none' && hasChildren.value) {
    // When selection is off, the row's only useful action is toggling expansion.
    toggleNode(props.node.key)
  }
}

function handleCheckboxClick(e: Event) {
  e.stopPropagation()
  if (props.node.disabled) return
  selectNode(props.node.key, props.node)
}

function handleFocus() {
  focusedKey.value = props.node.key
}
</script>

<template>
  <div role="presentation">
    <div
      role="treeitem"
      :data-tree-key="node.key"
      :tabindex="isFocused ? 0 : -1"
      :aria-expanded="hasChildren ? expanded : undefined"
      :aria-selected="selectionMode !== 'none' ? selected : undefined"
      :aria-disabled="node.disabled || undefined"
      :aria-level="level"
      :aria-setsize="setSize"
      :aria-posinset="posInSet"
      :class="cn(
        treeViewNodeTheme({ selected, disabled: node.disabled }),
      )"
      @click="handleRowClick"
      @keydown="handleKeydown($event, node)"
      @focus="handleFocus"
    >
      <!-- Chevron (parents) — also displays loading spinner or retry icon based on async state. -->
      <template v-if="hasChildren">
        <slot
          name="chevron"
          :is-expanded="expanded"
          :is-loading="isLoading"
          :is-error="isError"
          :toggle="() => toggleNode(node.key)"
          :retry="() => reload(node.key)"
        >
          <!-- Loading: spinner replaces chevron while the children are being fetched. -->
          <span
            v-if="isLoading"
            class="size-3 shrink-0 rounded-full border border-ousi-muted/30 border-t-ousi-muted animate-spin"
            role="status"
            aria-label="Loading"
          />
          <!-- Error: retry circle. Click reattempts the load. -->
          <svg
            v-else-if="isError"
            class="size-4 text-ousi-danger shrink-0 cursor-pointer hover:text-ousi-danger-foreground rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ousi-focus"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            tabindex="0"
            aria-label="Reload children"
            @click.stop="reload(node.key)"
            @keydown.enter.prevent="reload(node.key)"
          >
            <path d="M3 12a9 9 0 1015-6.7L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <!-- Default: chevron arrow. Rotates when expanded. -->
          <svg
            v-else
            :class="treeViewChevronTheme"
            :style="{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            @click="handleChevronClick"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </slot>
      </template>
      <span v-else :class="treeViewChevronSpacerTheme" aria-hidden="true" />

      <!-- Checkbox (only in multi-select mode) -->
      <OCheckbox
        v-if="selectionMode === 'multiple'"
        :model-value="selected"
        :disabled="node.disabled"
        tabindex="-1"
        @click="handleCheckboxClick"
      />

      <!-- Icon — uses node.icon as an SVG path 'd' attribute. Override entirely with #icon. -->
      <slot name="icon" :node="node" :is-expanded="expanded">
        <svg
          v-if="node.icon"
          :class="treeViewIconTheme"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path :d="node.icon" />
        </svg>
      </slot>

      <!-- Label / custom content -->
      <component
        v-if="treeSlots.node"
        :is="() => treeSlots.node!({ node, isExpanded: expanded, isSelected: selected, hasChildren })"
      />
      <span v-else class="truncate flex-1">{{ node.label }}</span>
    </div>

    <!-- Children (recursive). Uses effective children (static or async-loaded).
         role=group per ARIA tree pattern.
         Animated with the grid-rows 0fr→1fr trick — animates to height: auto smoothly. -->
    <Transition
      enter-active-class="grid transition-[grid-template-rows,opacity] duration-200 ease-out"
      leave-active-class="grid transition-[grid-template-rows,opacity] duration-150 ease-in"
      enter-from-class="grid-rows-[0fr] opacity-0"
      enter-to-class="grid-rows-[1fr] opacity-100"
      leave-from-class="grid-rows-[1fr] opacity-100"
      leave-to-class="grid-rows-[0fr] opacity-0"
    >
      <div
        v-if="expanded && renderChildren && renderChildren.length > 0"
        role="group"
      >
        <div :class="cn('overflow-hidden', treeViewChildrenTheme)">
          <TreeViewNode
            v-for="(child, i) in renderChildren"
            :key="child.key"
            :node="child"
            :level="level + 1"
            :pos-in-set="i + 1"
            :set-size="renderChildren.length"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>
