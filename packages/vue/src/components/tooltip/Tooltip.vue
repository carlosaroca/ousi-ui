<script setup lang="ts">
import { ref, computed, useId } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useMounted } from '@ousi-ui/core'
import { tooltipTheme } from './tooltip.theme'
import type { TooltipProps } from './tooltip.types'
import { useTooltip } from './use-tooltip'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  offset: 8,
  showArrow: true,
  delay: 200,
  closeDelay: 150,
  disabled: false,
  shadow: 'md',
})

const tooltipId = useId()
const isMounted = useMounted()

// Wrapper uses display:contents so the slot's layout is untouched.
// The anchor for floating-ui is the first real element inside the slot.
const triggerWrapperRef = ref<HTMLElement | null>(null)
const anchorRef = computed<HTMLElement | null>(() =>
  (triggerWrapperRef.value?.firstElementChild as HTMLElement | null) ?? triggerWrapperRef.value,
)

const {
  isOpen,
  floatingRef,
  arrowRef,
  content,
  shadow,
  showArrow,
  className,
  floatingStyles,
  enterAnimation,
  arrowStyles,
  show,
  hide,
  showImmediate,
  hideImmediate,
} = useTooltip(anchorRef, {
  content: () => props.content,
  placement: () => props.placement,
  offset: () => props.offset,
  showArrow: () => props.showArrow,
  delay: () => props.delay,
  closeDelay: () => props.closeDelay,
  disabled: () => props.disabled,
  shadow: () => props.shadow,
  class: () => props.class,
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') hideImmediate()
}
</script>

<template>
  <span
    ref="triggerWrapperRef"
    class="contents"
    :aria-describedby="isOpen ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="showImmediate"
    @blur="hideImmediate"
    @keydown="handleKeydown"
  >
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-if="isOpen && isMounted"
      ref="floatingRef"
      :style="floatingStyles"
      class="z-50"
    >
      <AnimatePresence>
        <Motion
          :id="tooltipId"
          tag="div"
          role="tooltip"
          :class="cn(tooltipTheme({ shadow }), className)"
          :initial="enterAnimation as any"
          :animate="{ opacity: 1, scale: 1, x: 0, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }"
        >
          {{ content }}

          <span
            v-if="showArrow"
            ref="arrowRef"
            data-slot="overlay-arrow"
            class="absolute h-2 w-2 rotate-45 bg-ousi-overlay"
            :style="arrowStyles"
          />
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
