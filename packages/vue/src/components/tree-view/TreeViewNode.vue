<script setup lang="ts">
import { computed, inject, type Ref, type Slots } from 'vue'
import { cn } from '@ousi-ui/core'
import type { TreeNode } from './tree-view.types'
import { treeViewNodeTheme, treeViewChildrenTheme, treeViewChevronTheme } from './tree-view.theme'

const props = defineProps<{
  node: TreeNode
}>()

const expandedKeys = inject<Set<string>>('tree-expanded')!
const selectedKey = inject<Ref<string | undefined>>('tree-selected')!
const selectable = inject<boolean>('tree-selectable')!
const toggleNode = inject<(key: string) => void>('tree-toggle')!
const selectNode = inject<(key: string, node: TreeNode) => void>('tree-select')!
const treeSlots = inject<Slots>('tree-slots')!

const hasChildren = computed(() => props.node.children && props.node.children.length > 0)
const isExpanded = computed(() => expandedKeys.has(props.node.key))
const isSelected = computed(() => selectedKey.value === props.node.key)

function handleClick() {
  if (props.node.disabled) return
  if (hasChildren.value) {
    toggleNode(props.node.key)
  }
  if (selectable) {
    selectNode(props.node.key, props.node)
  }
}
</script>

<template>
  <div>
    <div
      :class="cn(
        treeViewNodeTheme,
        isSelected && 'bg-ousi-accent/10 text-ousi-accent',
        node.disabled && 'opacity-50 pointer-events-none',
      )"
      @click="handleClick"
    >
      <!-- Chevron or spacer -->
      <component
        v-if="hasChildren && treeSlots.chevron"
        :is="() => treeSlots.chevron!({ isExpanded })"
      />
      <svg
        v-else-if="hasChildren"
        :class="treeViewChevronTheme"
        :style="{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
      <span v-else class="size-4 shrink-0" />

      <!-- Node content -->
      <component
        v-if="treeSlots.node"
        :is="() => treeSlots.node!({ node, isExpanded, isSelected, hasChildren })"
      />
      <span v-else class="truncate">{{ node.label }}</span>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && isExpanded" :class="treeViewChildrenTheme">
      <TreeViewNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
      />
    </div>
  </div>
</template>
