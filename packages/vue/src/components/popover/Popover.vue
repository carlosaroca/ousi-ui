<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import {
  useFloating,
  autoUpdate,
  offset as floatingOffset,
  flip,
  shift,
  arrow,
} from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useMounted, useEscapeKey } from '@ousi-ui/core'
import {
  popoverPanelTheme,
  popoverDialogTheme,
  popoverHeadingTheme,
  popoverTriggerTheme,
} from './popover.theme'
import type { PopoverProps, PopoverEmits } from './popover.types'

const props = withDefaults(defineProps<PopoverProps>(), {
  placement: 'bottom',
  offset: 8,
  showArrow: false,
})

const emit = defineEmits<PopoverEmits>()

const isMounted = useMounted()
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)

const middleware = computed(() => {
  const mw = [
    floatingOffset(props.showArrow ? props.offset + 6 : props.offset),
    flip(),
    shift({ padding: 8 }),
  ]
  if (props.showArrow) mw.push(arrow({ element: arrowRef }))
  return mw
})

const { floatingStyles, placement: currentPlacement, middlewareData } = useFloating(
  triggerRef,
  panelRef,
  {
    placement: computed(() => props.placement),
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware,
  },
)

const placementBase = computed(() =>
  (currentPlacement.value?.split('-')[0]) ?? 'bottom',
)

const arrowSide = computed(() =>
  ({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' })[placementBase.value] ?? 'top',
)

const arrowStyles = computed(() => {
  const data = middlewareData.value.arrow
  if (!data) return {}
  const s: Record<string, string> = {}
  if (data.x != null) s.left = `${data.x}px`
  if (data.y != null) s.top = `${data.y}px`
  s[arrowSide.value] = '-4px'
  return s
})

const enterAnimation = computed(() => {
  const map: Record<string, object> = {
    top: { opacity: 0, scale: 0.9, y: 4 },
    bottom: { opacity: 0, scale: 0.9, y: -4 },
    left: { opacity: 0, scale: 0.9, x: 4 },
    right: { opacity: 0, scale: 0.9, x: -4 },
  }
  return map[placementBase.value] ?? map.bottom
})

function open() { isOpen.value = true; emit('open') }
function close() { isOpen.value = false; emit('close') }
function toggle() { isOpen.value ? close() : open() }

useEscapeKey({ handler: () => close(), enabled: isOpen })

function handleClickOutside(e: MouseEvent) {
  const t = e.target as Node
  if (!triggerRef.value?.contains(t) && !panelRef.value?.contains(t)) close()
}

watch(isOpen, (v) => {
  if (v) document.addEventListener('pointerdown', handleClickOutside, true)
  else document.removeEventListener('pointerdown', handleClickOutside, true)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleClickOutside, true))

defineExpose({ open, close, toggle })
</script>

<template>
  <!-- Trigger -->
  <span ref="triggerRef" :class="popoverTriggerTheme" @click="toggle">
    <slot name="trigger" :open="isOpen" :toggle="toggle" />
  </span>

  <!-- Panel -->
  <Teleport to="body">
    <div
      v-if="isOpen && isMounted"
      ref="panelRef"
      :style="floatingStyles"
      class="z-50"
    >
      <AnimatePresence>
        <Motion
          tag="div"
          :class="cn(popoverPanelTheme, props.class)"
          :initial="(enterAnimation as any)"
          :animate="{ opacity: 1, scale: 1, x: 0, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }"
          role="dialog"
          :aria-modal="false"
        >
          <!-- Arrow -->
          <span
            v-if="showArrow"
            ref="arrowRef"
            class="absolute h-2 w-2 rotate-45 bg-ousi-overlay"
            :style="arrowStyles"
            aria-hidden="true"
          />

          <!-- Dialog interior -->
          <div :class="popoverDialogTheme">
            <p v-if="title" :class="popoverHeadingTheme">{{ title }}</p>
            <slot :close="close" />
          </div>
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
