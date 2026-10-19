<script setup lang="ts">
import { useOusiConfig, useOusiMessages } from '../../config'
import { computed, provide, ref, toRef, useId, watch } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useScrollLock, useMounted, useLayer, useFocusScope } from '@ousi-ui/core'
import { useHaptics } from '@ousi-ui/haptics'
import {
  dialogBackdropTheme,
  dialogContainerTheme,
  dialogPanelTheme,
  dialogWrapperTheme,
} from './dialog.theme'
import { DIALOG_CONTEXT } from './dialog-context'
import type { DialogProps, DialogEmits } from './dialog.types'

const ousiText = useOusiMessages()
const ousiConfig = useOusiConfig()

const props = withDefaults(defineProps<DialogProps>(), {
  size: 'md',
  placement: 'center',
  backdrop: undefined,
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
const resolvedBackdrop = computed(() => props.backdrop ?? ousiConfig.backdrop.value)

const titleCount = ref(0)
provide(DIALOG_CONTEXT, {
  titleId,
  scrollBehavior: toRef(props, 'scrollBehavior'),
  registerTitle: () => {
    titleCount.value++
    return () => titleCount.value--
  },
})

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

useScrollLock(isOpenRef)

const rootRef = ref<HTMLElement | null>(null)
const { zIndex, backdropZIndex } = useLayer(isOpenRef, {
  elements: rootRef,
  modal: true,
  restoreFocus: false,
  onEscape: () => tryClose(),
})

// A backdrop click dismisses only when the press also started on the backdrop, so a drag out of
// the panel or a press in a layer above the dialog never closes it.
let pressedBackdrop = false
function onBackdropPointerDown(event: PointerEvent) {
  pressedBackdrop = event.target === event.currentTarget
}
function onBackdropClick(event: MouseEvent) {
  if (pressedBackdrop && event.target === event.currentTarget) tryClose()
  pressedBackdrop = false
}

// Focus moves into the dialog on open, Tab stays inside it, and focus returns to the trigger on close.
const dialogRef = ref<HTMLElement | null>(null)
useFocusScope({ containerRef: dialogRef, enabled: isOpenRef })

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
      <div v-if="modelValue && isMounted" ref="rootRef" class="contents">
        <Motion
          tag="div"
          :class="dialogBackdropTheme({ backdrop: resolvedBackdrop })"
          :style="{ zIndex: backdropZIndex }"
          :initial="({ opacity: 0 } as any)"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.15, ease: 'easeOut' }"
          aria-hidden="true"
        />

        <div
          :class="dialogContainerTheme({ scrollBehavior, size })"
          :style="{ zIndex }"
          @pointerdown="onBackdropPointerDown"
          @click="onBackdropClick"
        >
          <Motion
            tag="div"
            :class="dialogWrapperTheme({ size, placement, scrollBehavior })"
            :initial="(panelEnter as any)"
            :animate="{ opacity: 1, scale: 1, y: 0 }"
            :exit="{ opacity: 0, scale: 0.95 }"
            :transition="{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }"
          >
            <!-- The dialog spans the panel and the close button, which sits outside the panel's
                 corner so the panel's overflow doesn't clip it. -->
            <div
              :id="dialogId"
              ref="dialogRef"
              role="dialog"
              aria-modal="true"
              :aria-labelledby="titleCount > 0 ? titleId : undefined"
              tabindex="-1"
              class="relative flex min-h-0 flex-1 flex-col outline-none"
            >
              <div :class="cn(dialogPanelTheme({ size, scrollBehavior, shadow }), props.class)">
                <slot :title-id="titleId" :close="close" />
              </div>

              <button
                v-if="!hideCloseButton"
                type="button"
                class="absolute flex items-center justify-center w-8 h-8 rounded-ousi-xl bg-ousi-surface text-ousi-foreground shadow-ousi-sm transition-[transform,box-shadow] duration-200 ease-out hover:shadow-ousi-xs hover:scale-[0.97] active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ousi-focus"
                :class="size === 'full' ? 'top-3 right-3' : '-top-3 -right-3'"
                :aria-label="ousiText.closeDialog"
                @click="close"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </Motion>
        </div>
      </div>
    </AnimatePresence>
  </Teleport>
</template>
