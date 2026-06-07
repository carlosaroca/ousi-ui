<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { cn } from '@ousi-ui/core'
import {
  contextMenuTheme,
  contextMenuItemTheme,
  contextMenuSeparatorTheme,
  contextMenuShortcutTheme,
  contextMenuHeadingTheme,
  contextMenuChevronTheme,
  contextMenuIconTheme,
} from './context-menu.theme'
import type { ContextMenuItem, ContextMenuShadow } from './context-menu.types'

type VirtualElement = { getBoundingClientRect: () => DOMRect | {
  x: number; y: number; top: number; left: number;
  right: number; bottom: number; width: number; height: number
} }

const props = withDefaults(defineProps<{
  items: ContextMenuItem[]
  shadow: ContextMenuShadow
  /** Virtual point anchor for the root menu (a 0×0 rect at clientX/clientY). */
  virtualAnchor?: VirtualElement | null
  /** When provided, this list is a submenu anchored to that element via floating-ui. */
  anchorEl?: HTMLElement | null
  /** Pixel gap between a parent item and its open submenu. */
  submenuOffset?: number
  /** Class on the menu surface. */
  class?: string
  level?: number
}>(), {
  submenuOffset: 4,
})

const emit = defineEmits<{
  select: [key: string, item: ContextMenuItem]
  /** Close just this level (Escape, ArrowLeft, hover out for submenus). */
  close: []
  /** Close the whole tree (after selection of a leaf without keepOpen, or click outside). */
  closeAll: []
}>()

defineOptions({ name: 'ContextMenuList' })

const menuRef = ref<HTMLElement | null>(null)
const itemRefs = ref<(HTMLElement | null)[]>([])
const focusedIndex = ref(-1)
const openSubmenuIndex = ref(-1)

// Fixed-per-instance: a list is either a submenu (anchored to a DOM element)
// or the root (anchored to a virtual point). It never switches mid-life.
const isSubmenu = !!props.anchorEl
const anchorRef = computed(() => props.anchorEl ?? props.virtualAnchor ?? null)

// Floating-ui drives positioning for both modes so flip/shift kick in near viewport edges.
// Root: 0×0 virtual anchor + 'bottom-start' → menu top-left lands at clientX/clientY.
// Submenu: element anchor + 'right-start' + submenuOffset gap (unchanged behavior).
const { floatingStyles } = useFloating(anchorRef, menuRef, {
  placement: isSubmenu ? 'right-start' : 'bottom-start',
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(isSubmenu ? props.submenuOffset : 0),
    flip(),
    shift({ padding: 8 }),
  ],
})

function isSelectable(item: ContextMenuItem): boolean {
  return !item.separator && !item.heading && !item.disabled
}

function selectableIndices(): number[] {
  return props.items.reduce<number[]>((acc, item, i) => {
    if (isSelectable(item)) acc.push(i)
    return acc
  }, [])
}

function itemKey(item: ContextMenuItem): string {
  return item.key ?? item.label ?? ''
}

function setItemRef(el: any, index: number) {
  itemRefs.value[index] = el ?? null
}

function activateItem(item: ContextMenuItem, index: number) {
  if (!isSelectable(item)) return
  if (item.children?.length) {
    openSubmenuIndex.value = index
    return
  }
  emit('select', itemKey(item), item)
  if (!item.keepOpen) emit('closeAll')
}

function handleItemClick(item: ContextMenuItem, index: number) {
  if (!isSelectable(item)) return
  if (item.children?.length) {
    openSubmenuIndex.value = openSubmenuIndex.value === index ? -1 : index
    return
  }
  emit('select', itemKey(item), item)
  if (!item.keepOpen) emit('closeAll')
}

function handlePointerEnter(item: ContextMenuItem, index: number) {
  if (!isSelectable(item)) {
    focusedIndex.value = -1
    openSubmenuIndex.value = -1
    return
  }
  focusedIndex.value = index
  openSubmenuIndex.value = item.children?.length ? index : -1
}

function handleKeydown(e: KeyboardEvent) {
  const indices = selectableIndices()
  if (!indices.length && e.key !== 'Escape') return

  if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    emit('close')
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const cur = indices.indexOf(focusedIndex.value)
    focusedIndex.value = cur < indices.length - 1 ? indices[cur + 1] : indices[0]
    openSubmenuIndex.value = -1
    return
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const cur = indices.indexOf(focusedIndex.value)
    focusedIndex.value = cur > 0 ? indices[cur - 1] : indices[indices.length - 1]
    openSubmenuIndex.value = -1
    return
  }
  if (e.key === 'ArrowRight') {
    const item = props.items[focusedIndex.value]
    if (item?.children?.length) {
      e.preventDefault()
      openSubmenuIndex.value = focusedIndex.value
    }
    return
  }
  if (e.key === 'ArrowLeft') {
    if (isSubmenu) {
      e.preventDefault()
      e.stopPropagation()
      emit('close')
    }
    return
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (focusedIndex.value >= 0) {
      const item = props.items[focusedIndex.value]
      if (item) activateItem(item, focusedIndex.value)
    }
    return
  }
  if (e.key === 'Home') {
    e.preventDefault()
    focusedIndex.value = indices[0]
    return
  }
  if (e.key === 'End') {
    e.preventDefault()
    focusedIndex.value = indices[indices.length - 1]
  }
}

onMounted(() => {
  nextTick(() => {
    menuRef.value?.focus()
    // Submenus auto-focus the first item (per WAI-ARIA AP). Root menu starts unfocused.
    if (isSubmenu) {
      const indices = selectableIndices()
      if (indices.length) focusedIndex.value = indices[0]
    }
  })
})

// When a submenu opens via keyboard, the new ContextMenuList instance mounts and
// auto-focuses itself. Nothing to do here.
watch(openSubmenuIndex, () => { /* no-op */ })
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-[opacity,scale] duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-[opacity,scale] duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
      appear
    >
      <div
        ref="menuRef"
        :class="cn(contextMenuTheme({ shadow }), 'origin-top-left', props.class)"
        :style="floatingStyles"
        tabindex="-1"
        role="menu"
        @keydown="handleKeydown"
      >
        <template v-for="(item, index) in items" :key="`${itemKey(item)}-${index}`">
          <!-- Separator -->
          <div
            v-if="item.separator"
            :class="contextMenuSeparatorTheme"
            role="separator"
          />
          <!-- Section heading -->
          <div
            v-else-if="item.heading"
            :class="contextMenuHeadingTheme"
            role="presentation"
          >
            {{ item.label }}
          </div>
          <!-- Menu item -->
          <div
            v-else
            :ref="(el) => setItemRef(el, index)"
            :class="cn(
              contextMenuItemTheme,
              !item.disabled && 'hover:bg-ousi-default',
              item.danger && 'text-ousi-danger hover:bg-ousi-danger/10',
              item.disabled && 'opacity-50 pointer-events-none',
              focusedIndex === index && 'bg-ousi-default',
            )"
            role="menuitem"
            :tabindex="-1"
            :aria-disabled="item.disabled || undefined"
            :aria-haspopup="item.children?.length ? 'menu' : undefined"
            :aria-expanded="item.children?.length ? (openSubmenuIndex === index) : undefined"
            @click="handleItemClick(item, index)"
            @pointerenter="handlePointerEnter(item, index)"
          >
            <!-- Icon: per-item slot wins; else string → class; else component. -->
            <slot name="icon" :item="item">
              <span
                v-if="typeof item.icon === 'string' && item.icon"
                :class="cn(contextMenuIconTheme, item.icon)"
                aria-hidden="true"
              />
              <component
                v-else-if="item.icon"
                :is="item.icon"
                :class="contextMenuIconTheme"
                aria-hidden="true"
              />
            </slot>

            <span class="truncate flex-1">{{ item.label }}</span>

            <!-- Submenu chevron -->
            <svg
              v-if="item.children?.length"
              :class="contextMenuChevronTheme"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            <!-- Shortcut (hidden when item has children) -->
            <span
              v-else-if="item.shortcut"
              :class="contextMenuShortcutTheme"
            >
              {{ item.shortcut }}
            </span>
          </div>
        </template>
      </div>
    </Transition>
  </Teleport>

  <!-- Recursive submenu — anchored to the parent item's element. -->
  <template v-for="(item, index) in items" :key="`sub-${itemKey(item)}-${index}`">
    <ContextMenuList
      v-if="item.children?.length && openSubmenuIndex === index && itemRefs[index]"
      :items="item.children"
      :shadow="shadow"
      :submenu-offset="submenuOffset"
      :anchor-el="itemRefs[index]"
      :level="(level ?? 1) + 1"
      @select="(k, it) => emit('select', k, it)"
      @close="openSubmenuIndex = -1"
      @close-all="emit('closeAll')"
    >
      <template #icon="slotProps: { item: ContextMenuItem }">
        <slot name="icon" :item="slotProps.item" />
      </template>
    </ContextMenuList>
  </template>
</template>
