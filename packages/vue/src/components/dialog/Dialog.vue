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
  placement: 'auto',
  backdrop: 'opaque',
  scrollBehavior: 'inside',
  hideCloseButton: false,
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

const { trigger: triggerHaptic } = useHaptics()

watch(isOpenRef, (val) => {
  if (val) {
    const preset = props.haptic !== undefined ? props.haptic : 'medium' as const
    triggerHaptic(preset)
  }
})

// Scroll lock
useScrollLock(isOpenRef)

// Escape key
useEscapeKey({
  handler: () => close(),
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
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.15, ease: 'easeOut' }"
          aria-hidden="true"
          @click.self="close"
        >
          <!-- Container -->
          <div
            :class="dialogContainerTheme({ placement, scrollBehavior })"
            @click.self="close"
          >
            <!-- Panel -->
            <Motion
              tag="div"
              :id="dialogId"
              role="dialog"
              aria-modal="true"
              :aria-labelledby="titleId"
              :class="cn(dialogPanelTheme({ size, placement, scrollBehavior }), props.class)"
              :initial="panelEnter"
              :animate="{ opacity: 1, scale: 1, y: 0 }"
              :exit="{ opacity: 0, scale: 0.95 }"
              :transition="{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }"
              @click.stop
            >
              <!-- Close button -->
              <button
                v-if="!hideCloseButton"
                type="button"
                class="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors"
                aria-label="Close dialog"
                @click="close"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>

              <slot :title-id="titleId" :close="close" />
            </Motion>
          </div>
        </Motion>
      </div>
    </AnimatePresence>
  </Teleport>
</template>
