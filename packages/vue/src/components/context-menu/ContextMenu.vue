<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { cn } from '@ousi-ui/core'
import {
  contextMenuTheme,
  contextMenuItemTheme,
  contextMenuSeparatorTheme,
  contextMenuShortcutTheme,
} from './context-menu.theme'
import type { ContextMenuProps, ContextMenuEmits, ContextMenuItem } from './context-menu.types'

const props = withDefaults(defineProps<ContextMenuProps>(), {
  disabled: false,
})

const emit = defineEmits<ContextMenuEmits>()

const isOpen = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const menuRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(-1)

function getSelectableItems(): ContextMenuItem[] {
  return props.items.filter(item => !item.separator && !item.disabled)
}

function getSelectableIndices(): number[] {
  return props.items.reduce<number[]>((acc, item, i) => {
    if (!item.separator && !item.disabled) acc.push(i)
    return acc
  }, [])
}

function onContextMenu(e: MouseEvent) {
  if (props.disabled) return
  e.preventDefault()
  menuX.value = e.clientX
  menuY.value = e.clientY
  isOpen.value = true
  focusedIndex.value = -1
  nextTick(() => {
    menuRef.value?.focus()
  })
}

function close() {
  isOpen.value = false
  focusedIndex.value = -1
}

function selectItem(item: ContextMenuItem) {
  if (item.disabled || item.separator) return
  emit('select', item.key, item)
  close()
}

function onPointerDown(e: PointerEvent) {
  if (!isOpen.value) return
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    close()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return

  const indices = getSelectableIndices()
  if (!indices.length) return

  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const currentPos = indices.indexOf(focusedIndex.value)
    focusedIndex.value = currentPos < indices.length - 1
      ? indices[currentPos + 1]
      : indices[0]
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const currentPos = indices.indexOf(focusedIndex.value)
    focusedIndex.value = currentPos > 0
      ? indices[currentPos - 1]
      : indices[indices.length - 1]
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    if (focusedIndex.value >= 0) {
      const item = props.items[focusedIndex.value]
      if (item) selectItem(item)
    }
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <div @contextmenu="onContextMenu">
    <slot />
  </div>

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="menuRef"
        :class="cn(contextMenuTheme, props.class)"
        :style="{ position: 'fixed', left: `${menuX}px`, top: `${menuY}px` }"
        tabindex="-1"
        role="menu"
        @keydown="onKeydown"
      >
        <template v-for="(item, index) in items" :key="item.key">
          <div
            v-if="item.separator"
            :class="contextMenuSeparatorTheme"
            role="separator"
          />
          <div
            v-else
            :class="cn(
              contextMenuItemTheme,
              item.danger && 'text-ousi-danger hover:bg-ousi-danger/10',
              item.disabled && 'opacity-50 pointer-events-none',
              focusedIndex === index && 'bg-ousi-default',
            )"
            role="menuitem"
            :aria-disabled="item.disabled || undefined"
            @click="selectItem(item)"
            @pointerenter="!item.disabled && (focusedIndex = index)"
            @pointerleave="focusedIndex = -1"
          >
            <span v-if="item.icon" :class="item.icon" aria-hidden="true" />
            <span>{{ item.label }}</span>
            <span
              v-if="item.shortcut"
              :class="contextMenuShortcutTheme"
            >
              {{ item.shortcut }}
            </span>
          </div>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>
