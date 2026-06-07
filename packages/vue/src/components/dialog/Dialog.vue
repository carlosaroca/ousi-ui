<script setup lang="ts">
import { computed, toRef, useId, watch } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useScrollLock, useMounted, useEscapeKey } from '@ousi-ui/core'
import { useHaptics } from '@ousi-ui/haptics'
import {
  dialogBackdropTheme,
  dialogContainerTheme,
  dialogPanelTheme,
} from './dialog.theme'
import type { DialogProps, DialogEmits } from './dialog.types'

const props = withDefaults(defineProps<DialogProps>(), {
  size: 'md',
  placement: 'center',
  backdrop: 'opaque',
  scrollBehavior: 'inside',
  hideCloseButton: false,
  preventClose: false,
  shadow: 'xl',
})

const emit = defineEmits<DialogEmits>()

const isMounted = useMounted()
const dialogId = useId()
const titleId = useId()

const isOpenRef = toRef(props, 'modelValue')

function close() {
  emit('update:modelValue', false)
  emit('close')
}

// Implicit dismissal (Escape, backdrop click) — gated by preventClose.
// The X button calls `close()` directly so it always works (unless also hidden).
function tryClose() {
  if (props.preventClose) return
  close()
}

const { trigger: triggerHaptic } = useHaptics()

watch(isOpenRef, (val) => {
  if (val) {
    const preset = props.haptic !== undefined ? props.haptic : 'medium' as const
    triggerHaptic(preset)
  }
})

// Scroll lock
useScrollLock(isOpenRef)

// Escape key — gated by preventClose
useEscapeKey({
  handler: () => tryClose(),
  enabled: isOpenRef,
})

// Panel enter animation based on placement
const panelEnter = computed(() => {
  const map: Record<string, object> = {
    auto: { opacity: 0, scale: 1.05, y: 8 },
    top: { opacity: 0, scale: 1.05, y: -8 },
    center: { opacity: 0, scale: 1.05 },
    bottom: { opacity: 0, scale: 1.05, y: 8 },
  }
  return map[props.placement] ?? map.auto
})
</script>

<template>
  <Teleport to="body">
    <AnimatePresence>
      <div v-if="modelValue && isMounted" class="contents">
        <!-- Backdrop -->
        <Motion
          tag="div"
          :class="dialogBackdropTheme({ backdrop })"
          :initial="({ opacity: 0 } as any)"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.15, ease: 'easeOut' }"
          aria-hidden="true"
          @click.self="tryClose"
        >
          <!-- Container -->
          <div
            :class="dialogContainerTheme({ placement, scrollBehavior })"
            @click.self="tryClose"
          >
            <!-- Animated wrapper — holds panel + external close button. Animation lives on the wrapper
                 so the close button (sibling of panel, positioned outside it) animates together with the
                 panel without being clipped by the panel's overflow-hidden. -->
            <Motion
              tag="div"
              class="relative pointer-events-auto"
              :class="size === 'full' || size === 'cover' ? 'w-full h-full' : 'w-fit max-w-full'"
              :initial="(panelEnter as any)"
              :animate="{ opacity: 1, scale: 1, y: 0 }"
              :exit="{ opacity: 0, scale: 0.95 }"
              :transition="{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }"
              @click.stop
            >
              <!-- Panel -->
              <div
                :id="dialogId"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="titleId"
                :class="cn(dialogPanelTheme({ size, placement, scrollBehavior, shadow }), props.class)"
              >
                <slot :title-id="titleId" :close="close" />
              </div>

              <!-- External close button — pops out at the top-right corner of the panel. Shadow at rest,
                   pressed-in feel on hover (shadow drops + scale-95). -->
              <button
                v-if="!hideCloseButton"
                type="button"
                class="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 rounded-ousi-xl bg-ousi-surface text-ousi-foreground shadow-ousi-sm transition-[transform,box-shadow] duration-200 ease-out hover:shadow-ousi-xs hover:scale-[0.97] active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ousi-focus"
                aria-label="Close dialog"
                @click="close"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </Motion>
          </div>
        </Motion>
      </div>
    </AnimatePresence>
  </Teleport>
</template>
