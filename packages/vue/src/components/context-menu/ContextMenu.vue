<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ContextMenuList from './ContextMenuList.vue'
import type {
  ContextMenuProps,
  ContextMenuEmits,
  ContextMenuItem,
  ContextMenuExposed,
} from './context-menu.types'

const props = withDefaults(defineProps<ContextMenuProps>(), {
  disabled: false,
  shadow: 'lg',
  submenuOffset: 4,
})

const emit = defineEmits<ContextMenuEmits>()

const isOpen = ref(false)
// Virtual reference for floating-ui — a 0×0 rect at (x, y) acts as a point anchor,
// so flip/shift middleware can reposition the menu when it would overflow the viewport.
function pointRect(x: number, y: number) {
  return {
    getBoundingClientRect: () => ({
      x, y, top: y, left: x, right: x, bottom: y, width: 0, height: 0,
    }),
  }
}
const virtualAnchor = ref(pointRect(0, 0))

function show(input?: MouseEvent | { x: number; y: number }) {
  if (props.disabled) return
  if (input && 'clientX' in input) {
    virtualAnchor.value = pointRect(input.clientX, input.clientY)
  } else if (input && 'x' in input) {
    virtualAnchor.value = pointRect(input.x, input.y)
  } else {
    virtualAnchor.value = pointRect(0, 0)
  }
  if (!isOpen.value) {
    isOpen.value = true
    emit('open')
  }
}

function hide() {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close')
}

function handleContextMenu(e: MouseEvent) {
  if (props.disabled) return
  e.preventDefault()
  show(e)
}

function handleSelect(key: string, item: ContextMenuItem) {
  emit('select', key, item)
}

function handlePointerDown(e: PointerEvent) {
  if (!isOpen.value) return
  // Close if the click landed outside any menu surface (root + any submenu, all under [role=menu]).
  const path = e.composedPath() as HTMLElement[]
  const inMenu = path.some((n) => n?.getAttribute?.('role') === 'menu')
  if (!inMenu) hide()
}

onMounted(() => {
  document.addEventListener('pointerdown', handlePointerDown, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handlePointerDown, true)
})

defineExpose<ContextMenuExposed>({
  show,
  hide,
  isOpen,
})
</script>

<template>
  <div @contextmenu="handleContextMenu">
    <slot />
  </div>

  <ContextMenuList
    v-if="isOpen"
    :items="items"
    :shadow="shadow"
    :submenu-offset="submenuOffset"
    :virtual-anchor="virtualAnchor"
    :class="props.class"
    @select="handleSelect"
    @close="hide"
    @close-all="hide"
  >
    <template #icon="{ item }">
      <slot name="icon" :item="item" />
    </template>
  </ContextMenuList>
</template>
