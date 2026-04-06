<script setup lang="ts">
import { ref, reactive, provide, useSlots } from 'vue'
import { cn } from '@ousi-ui/core'
import type { TreeViewProps, TreeViewEmits, TreeNode } from './tree-view.types'
import { treeViewTheme } from './tree-view.theme'
import TreeViewNode from './TreeViewNode.vue'

const props = withDefaults(defineProps<TreeViewProps>(), {
  selectable: false,
})

const emit = defineEmits<TreeViewEmits>()

const expandedKeys = reactive(new Set<string>(props.defaultExpanded || []))
const selectedKey = ref<string | undefined>(props.selectedKey)

function toggleNode(key: string) {
  if (expandedKeys.has(key)) {
    expandedKeys.delete(key)
    emit('collapse', key)
  } else {
    expandedKeys.add(key)
    emit('expand', key)
  }
}

function selectNode(key: string, node: TreeNode) {
  selectedKey.value = key
  emit('select', key, node)
}

const slots = useSlots()

provide('tree-expanded', expandedKeys)
provide('tree-selected', selectedKey)
provide('tree-selectable', props.selectable)
provide('tree-toggle', toggleNode)
provide('tree-select', selectNode)
provide('tree-slots', slots)
</script>

<template>
  <div :class="cn(treeViewTheme, props.class)">
    <TreeViewNode v-for="node in nodes" :key="node.key" :node="node" />
  </div>
</template>
