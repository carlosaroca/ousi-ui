<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { provideMenu } from './dropdown.context'
import { dropdownMenuTheme } from './dropdown.theme'
import type { DropdownMenuProps, DropdownMenuEmits } from './dropdown.types'

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  selectionMode: 'none',
})
const emit = defineEmits<DropdownMenuEmits>()

const internalSelected = ref<Set<string>>(new Set(props.defaultSelectedKeys ?? []))

const selectedKeys = computed(() =>
  props.selectedKeys !== undefined ? props.selectedKeys : internalSelected.value,
)

function toggleSelection(key: string) {
  if (props.selectionMode === 'none') return
  const next = new Set(selectedKeys.value)
  if (props.selectionMode === 'single') {
    next.clear()
    if (!selectedKeys.value.has(key)) next.add(key)
  } else {
    if (next.has(key)) next.delete(key)
    else next.add(key)
  }
  internalSelected.value = next
  emit('selectionChange', next)
  emit('update:selectedKeys', next)
}

function onAction(key: string) {
  emit('action', key)
}

provideMenu({
  selectionMode: computed(() => props.selectionMode),
  selectedKeys,
  disabledKeys: computed(() => props.disabledKeys ?? new Set()),
  toggleSelection,
  onAction,
})
</script>

<template>
  <ul role="menu" :class="cn(dropdownMenuTheme, props.class)">
    <slot />
  </ul>
</template>
