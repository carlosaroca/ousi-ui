<script setup lang="ts">
import { useOusiConfig, useOusiMessages } from '../../config'
import { ref, computed, watch, useId } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useScrollLock, useMounted, useLayer, useFocusScope } from '@ousi-ui/core'
import {
  drawerBackdropTheme,
  drawerContentTheme,
  drawerPanelTheme,
} from './drawer.theme'
import type { DrawerProps, DrawerEmits, DrawerPlacement } from './drawer.types'
import { useSwipeDismiss, type SwipeDirection } from './use-swipe-dismiss'

const ousiText = useOusiMessages()

const props = withDefaults(defineProps<DrawerProps>(), {
  placement: 'right',
  backdrop: undefined,
  showHandle: false,
  showCloseButton: true,
  swipeToClose: true,
  shadow: 'xl',
  size: 'sm',
})

const emit = defineEmits<DrawerEmits>()

const isMounted = useMounted()
const drawerId = useId()
const ousiConfig = useOusiConfig()
const resolvedBackdrop = computed(() => props.backdrop ?? ousiConfig.backdrop.value)

const isOpen = ref(props.modelValue ?? false)

watch(() => props.modelValue, (val) => { isOpen.value = val ?? false })

function open() {
  isOpen.value = true
  emit('update:modelValue', true)
  emit('open')
}

function close() {
  isOpen.value = false
  emit('update:modelValue', false)
  emit('close')
}

useScrollLock(isOpen)

const rootRef = ref<HTMLElement | null>(null)
const { zIndex, backdropZIndex } = useLayer(isOpen, {
  elements: rootRef,
  modal: true,
  restoreFocus: false,
  onEscape: () => close(),
})

// A backdrop click dismisses only when the press also started on the backdrop, so a press in a
// layer above the drawer never closes it.
let pressedBackdrop = false
function onBackdropPointerDown(event: PointerEvent) {
  pressedBackdrop = event.target === event.currentTarget
}
function onBackdropClick(event: MouseEvent) {
  if (pressedBackdrop && event.target === event.currentTarget) close()
  pressedBackdrop = false
}

// Focus moves into the drawer on open, Tab stays inside it, and focus returns to the trigger on close.
const panelRef = ref<{ $el?: HTMLElement } | null>(null)
const panelEl = computed(() => panelRef.value?.$el ?? null)
useFocusScope({ containerRef: panelEl, enabled: isOpen })

function getBaseDirection(p: DrawerPlacement): 'top' | 'bottom' | 'left' | 'right' | 'center' {
  if (p === 'floating-center') return 'center'
  if (p === 'floating-left' || p === 'left') return 'left'
  if (p === 'floating-right' || p === 'right') return 'right'
  if (p === 'floating-top' || p === 'top') return 'top'
  if (p === 'floating-bottom' || p === 'bottom') return 'bottom'
  return 'right'
}

const baseDir = computed(() => getBaseDirection(props.placement))

const panelAnimation = computed(() => {
  const map: Record<string, { initial: object; animate: object; exit: object }> = {
    bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
    top:    { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
    left:   { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    right:  { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    center: { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 } },
  }
  return map[baseDir.value]
})

/* ── Swipe to close ────────────────────────────────────────────── */

// Back the way it came. A centred drawer came from nowhere, so there is no way to swipe it.
const swipeDirection = computed<SwipeDirection | undefined>(() => {
  if (!props.swipeToClose) return undefined
  const ways = { bottom: 'down', top: 'up', left: 'left', right: 'right', center: undefined } as const
  return ways[baseDir.value]
})

const swipe = useSwipeDismiss({
  direction: () => swipeDirection.value,
  panel: () => panelEl.value,
  onDismiss: close,
})
// A drawer swiped away keeps its place while it leaves; the next one starts from its own.
watch(isOpen, (open) => open && swipe.reset())

// The wrapper moves, not the panel, whose transform belongs to its entrance and exit.
const swipeStyle = computed(() => {
  const by = swipe.offset.value
  const way = swipeDirection.value
  if (!way) return {}
  const [x, y] = { down: [0, by], up: [0, -by], right: [by, 0], left: [-by, 0] }[way]
  return {
    transform: by ? `translate3d(${x}px, ${y}px, 0)` : undefined,
    transition: swipe.dragging.value ? 'none' : 'transform 300ms cubic-bezier(0.165, 0.84, 0.44, 1)',
  }
})
// The page comes back into view as the drawer is pulled away. A filter, so that the opacity stays
// with the entrance and exit; not on a blur, which a filter would undo.
const backdropFade = computed(() => {
  const blurs = resolvedBackdrop.value === 'blur' || resolvedBackdrop.value === 'glass'
  return swipe.offset.value && !blurs ? `opacity(${1 - swipe.progress.value})` : undefined
})

// A handle that cannot be pulled promises something it does not do, so it only comes unasked where
// the drawer can be swiped.
const showHandleBar = computed(() => {
  if (props.showHandle) return true
  return swipeDirection.value === 'down' || swipeDirection.value === 'up'
})

/** The handle sits on the edge the drawer is pulled by. The zone reaches the border of the panel. */
const handle = computed(() => {
  const across = { zone: 'flex shrink-0 items-center justify-center -mx-6', pill: 'h-1 w-9' }
  const along = { zone: 'absolute inset-y-0 flex w-5 items-center justify-center', pill: 'h-9 w-1' }
  return {
    bottom: { ...across, zone: `${across.zone} -mt-6 pt-6 pb-2` },
    center: { ...across, zone: `${across.zone} -mt-6 pt-6 pb-2` },
    top: { ...across, zone: `${across.zone} -mb-6 pt-4 pb-3` },
    left: { ...along, zone: `${along.zone} right-0` },
    right: { ...along, zone: `${along.zone} left-0` },
  }[baseDir.value]
})
const handleGrab = computed(() => swipeDirection.value && 'cursor-grab touch-none select-none active:cursor-grabbing')

defineExpose({ open, close })
</script>

<template>
  <!-- Trigger -->
  <span class="inline-flex" @click="open">
    <slot name="trigger" :open="open" />
  </span>

  <Teleport to="body">
    <AnimatePresence>
      <div v-if="isOpen && isMounted" ref="rootRef" class="contents">
        <!-- Backdrop -->
        <Motion
          tag="div"
          :class="drawerBackdropTheme({ backdrop: resolvedBackdrop })"
          :style="{ zIndex: backdropZIndex, filter: backdropFade }"
          :initial="({ opacity: 0 } as any)"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.2 }"
          aria-hidden="true"
          @pointerdown="onBackdropPointerDown"
          @click="onBackdropClick"
        />

        <!-- Content wrapper -->
        <div
          :class="cn(drawerContentTheme({ placement }), 'motion-reduce:!transition-none')"
          :style="{ zIndex, ...swipeStyle }"
        >
          <!-- Panel -->
          <Motion
            tag="div"
            :id="drawerId"
            role="dialog"
            aria-modal="true"
            ref="panelRef"
            :aria-label="title"
            tabindex="-1"
            :class="cn(drawerPanelTheme({ placement, shadow, size }), props.class)"
            :initial="(panelAnimation.initial as any)"
            :animate="(panelAnimation.animate as any)"
            :exit="(panelAnimation.exit as any)"
            :transition="{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }"
            v-on="swipe.handlers"
          >
            <!-- Handle bar. A drawer from the top is pulled by its bottom edge: see below. -->
            <div
              v-if="showHandleBar && baseDir !== 'top'"
              data-drawer-handle
              aria-hidden="true"
              :class="[handle.zone, handleGrab]"
            >
              <div :class="['rounded-full bg-ousi-border', handle.pill]" />
            </div>

            <!-- Close button -->
            <button
              v-if="showCloseButton"
              type="button"
              class="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors"
              :aria-label="ousiText.closeDrawer"
              @click="close"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <!-- Header -->
            <div v-if="title || description" class="flex flex-col gap-1 mb-4 pr-8">
              <h2 v-if="title" class="text-base font-medium text-ousi-foreground">{{ title }}</h2>
              <p v-if="description" class="text-sm text-ousi-muted">{{ description }}</p>
            </div>

            <slot name="header" />

            <!-- Body -->
            <div data-slot="drawer-body" class="flex-1 min-h-0 overflow-y-auto overscroll-contain text-sm text-ousi-muted">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex flex-row flex-wrap items-center justify-end gap-2 mt-5">
              <slot name="footer" :close="close" />
            </div>

            <div
              v-if="showHandleBar && baseDir === 'top'"
              data-drawer-handle
              aria-hidden="true"
              :class="[handle.zone, handleGrab]"
            >
              <div :class="['rounded-full bg-ousi-border', handle.pill]" />
            </div>
          </Motion>
        </div>
      </div>
    </AnimatePresence>
  </Teleport>
</template>
