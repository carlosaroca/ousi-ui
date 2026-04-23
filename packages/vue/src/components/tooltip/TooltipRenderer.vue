<script setup lang="ts">
import { ref, computed, useId, onMounted, onBeforeUnmount, watch } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useMounted } from '@ousi-ui/core'
import { tooltipTheme } from './tooltip.theme'
import { useTooltip, type TooltipConfig } from './use-tooltip'

/**
 * Internal component — renders a tooltip panel anchored to an external element.
 * Used by the `v-tooltip` directive. Not part of the public API.
 */
const props = defineProps<{
  anchor: HTMLElement
  options: TooltipConfig
}>()

const tooltipId = useId()
const isMounted = useMounted()
const anchorRef = ref<HTMLElement | null>(props.anchor)

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
  content: () => props.options.content,
  placement: () => props.options.placement,
  offset: () => props.options.offset,
  showArrow: () => props.options.showArrow,
  delay: () => props.options.delay,
  closeDelay: () => props.options.closeDelay,
  disabled: () => props.options.disabled,
  shadow: () => props.options.shadow,
  class: () => props.options.class,
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') hideImmediate()
}

const stopAria = watch(isOpen, (open) => {
  if (open) props.anchor.setAttribute('aria-describedby', tooltipId)
  else props.anchor.removeAttribute('aria-describedby')
})

onMounted(() => {
  props.anchor.addEventListener('mouseenter', show)
  props.anchor.addEventListener('mouseleave', hide)
  props.anchor.addEventListener('focus', showImmediate)
  props.anchor.addEventListener('blur', hideImmediate)
  props.anchor.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  props.anchor.removeEventListener('mouseenter', show)
  props.anchor.removeEventListener('mouseleave', hide)
  props.anchor.removeEventListener('focus', showImmediate)
  props.anchor.removeEventListener('blur', hideImmediate)
  props.anchor.removeEventListener('keydown', handleKeydown)
  props.anchor.removeAttribute('aria-describedby')
  stopAria()
})
</script>

<template>
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
