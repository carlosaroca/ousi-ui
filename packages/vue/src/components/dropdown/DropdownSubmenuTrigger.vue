<script setup lang="ts">
import { ref } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { useMounted } from '@ousi-ui/core'

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const isMounted = useMounted()

const { floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: 'right-start',
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(4), flip(), shift({ padding: 8 })],
})

let openTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

function handleEnter() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  openTimer = setTimeout(() => { isOpen.value = true }, 100)
}

function handleLeave() {
  if (openTimer) { clearTimeout(openTimer); openTimer = null }
  closeTimer = setTimeout(() => { isOpen.value = false }, 150)
}
</script>

<template>
  <li
    ref="triggerRef"
    role="presentation"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <slot name="trigger" />

    <Teleport to="body">
      <div
        v-if="isOpen && isMounted"
        ref="popoverRef"
        :style="floatingStyles"
        class="z-[60]"
        @mouseenter="handleEnter"
        @mouseleave="handleLeave"
      >
        <AnimatePresence>
          <Motion
            tag="div"
            class="rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground shadow-ousi-lg min-w-40 overflow-hidden"
            :initial="{ opacity: 0, x: -8 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: -8 }"
            :transition="{ duration: 0.15 }"
          >
            <slot name="popover" />
          </Motion>
        </AnimatePresence>
      </div>
    </Teleport>
  </li>
</template>
