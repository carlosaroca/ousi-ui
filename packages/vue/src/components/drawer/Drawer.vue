<script setup lang="ts">
import { ref, computed, watch, useId } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useScrollLock, useMounted, useEscapeKey } from '@ousi-ui/core'
import {
  drawerBackdropTheme,
  drawerContentTheme,
  drawerPanelTheme,
} from './drawer.theme'
import type { DrawerProps, DrawerEmits, DrawerPlacement } from './drawer.types'

const props = withDefaults(defineProps<DrawerProps>(), {
  placement: 'right',
  backdrop: 'opaque',
  showHandle: false,
  showCloseButton: true,
  shadow: 'xl',
})

const emit = defineEmits<DrawerEmits>()

const isMounted = useMounted()
const drawerId = useId()

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

useEscapeKey({
  handler: () => close(),
  enabled: isOpen,
})

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

const showHandleBar = computed(() => {
  if (props.showHandle) return true
  return baseDir.value === 'bottom' || baseDir.value === 'top'
})

defineExpose({ open, close })
</script>

<template>
  <!-- Trigger -->
  <span class="inline-flex" @click="open">
    <slot name="trigger" :open="open" />
  </span>

  <Teleport to="body">
    <AnimatePresence>
      <div v-if="isOpen && isMounted" class="contents">
        <!-- Backdrop -->
        <Motion
          tag="div"
          :class="drawerBackdropTheme({ backdrop })"
          :initial="({ opacity: 0 } as any)"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.2 }"
          aria-hidden="true"
          @click.self="close"
        />

        <!-- Content wrapper -->
        <div :class="drawerContentTheme({ placement })" style="z-index: 50">
          <!-- Panel -->
          <Motion
            tag="div"
            :id="drawerId"
            role="dialog"
            aria-modal="true"
            :aria-label="title"
            :class="cn(drawerPanelTheme({ placement, shadow }), props.class)"
            :initial="(panelAnimation.initial as any)"
            :animate="(panelAnimation.animate as any)"
            :exit="(panelAnimation.exit as any)"
            :transition="{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }"
          >
            <!-- Handle bar -->
            <div
              v-if="showHandleBar"
              class="flex items-center justify-center pb-2"
            >
              <div class="h-1 w-9 rounded-full bg-ousi-border" />
            </div>

            <!-- Close button -->
            <button
              v-if="showCloseButton"
              type="button"
              class="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors"
              aria-label="Close drawer"
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
            <div class="flex-1 min-h-0 overflow-y-auto text-sm text-ousi-muted">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex flex-row items-center justify-end gap-2 mt-5">
              <slot name="footer" :close="close" />
            </div>
          </Motion>
        </div>
      </div>
    </AnimatePresence>
  </Teleport>
</template>
