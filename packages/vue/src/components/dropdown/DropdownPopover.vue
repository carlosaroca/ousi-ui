<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useMounted } from '@ousi-ui/core'
import { useDropdownContext } from './dropdown.context'
import { dropdownPopoverTheme } from './dropdown.theme'
import type { DropdownPopoverProps } from './dropdown.types'

const props = withDefaults(defineProps<DropdownPopoverProps>(), {
  placement: 'bottom-start',
})

const { isOpen, triggerRef, shadow, close } = useDropdownContext()
const isMounted = useMounted()
const popoverRef = ref<HTMLElement | null>(null)

const { floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: computed(() => props.placement),
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(4), flip(), shift({ padding: 8 })],
})

const isTop = computed(() => props.placement.startsWith('top'))

function handleClickOutside(e: MouseEvent) {
  const t = e.target as Node
  if (!triggerRef.value?.contains(t) && !popoverRef.value?.contains(t)) close()
}

watch(isOpen, (v) => {
  if (v) document.addEventListener('pointerdown', handleClickOutside, true)
  else document.removeEventListener('pointerdown', handleClickOutside, true)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleClickOutside, true))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && isMounted"
      ref="popoverRef"
      :style="floatingStyles"
      class="z-50"
    >
      <AnimatePresence>
        <Motion
          tag="div"
          :class="cn(dropdownPopoverTheme({ shadow }), props.class)"
          :initial="{ opacity: 0, scale: 0.95, y: isTop ? 4 : -4 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }"
        >
          <slot />
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
