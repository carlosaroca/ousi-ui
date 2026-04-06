<script setup lang="ts">
import { ref, computed, useId } from 'vue'
import {
  useFloating,
  autoUpdate,
  offset as offsetMiddleware,
  flip,
  shift,
  arrow,
} from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useMounted } from '@ousi-ui/core'
import { tooltipTheme } from './tooltip.theme'
import type { TooltipProps } from './tooltip.types'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  offset: 8,
  showArrow: true,
  delay: 200,
  closeDelay: 150,
  disabled: false,
})

const tooltipId = useId()
const isMounted = useMounted()

const triggerRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)

const middleware = computed(() => {
  const mw = [
    offsetMiddleware(props.showArrow ? props.offset + 4 : props.offset),
    flip(),
    shift({ padding: 8 }),
  ]
  if (props.showArrow) {
    mw.push(arrow({ element: arrowRef }))
  }
  return mw
})

const { floatingStyles, placement: currentPlacement, middlewareData } = useFloating(
  triggerRef,
  floatingRef,
  {
    placement: computed(() => props.placement),
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware,
  },
)

const isOpen = ref(false)
let openTimeout: ReturnType<typeof setTimeout> | null = null
let closeTimeout: ReturnType<typeof setTimeout> | null = null

function show() {
  if (props.disabled) return
  if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null }
  openTimeout = setTimeout(() => { isOpen.value = true }, props.delay)
}

function hide() {
  if (openTimeout) { clearTimeout(openTimeout); openTimeout = null }
  closeTimeout = setTimeout(() => { isOpen.value = false }, props.closeDelay)
}

function handleFocus() {
  if (props.disabled) return
  if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null }
  isOpen.value = true
}

function handleBlur() {
  isOpen.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') isOpen.value = false
}

const basePlacement = computed(() =>
  (currentPlacement.value?.split('-')[0]) ?? 'top',
)

const enterAnimation = computed(() => {
  const map: Record<string, object> = {
    top:    { opacity: 0, scale: 0.9, y: 4 },
    bottom: { opacity: 0, scale: 0.9, y: -4 },
    left:   { opacity: 0, scale: 0.9, x: 4 },
    right:  { opacity: 0, scale: 0.9, x: -4 },
  }
  return map[basePlacement.value] ?? map.top
})

const arrowStaticSide = computed(() =>
  ({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' })[basePlacement.value] ?? 'bottom',
)

const arrowStyles = computed(() => {
  const data = middlewareData.value.arrow
  if (!data) return {}
  const s: Record<string, string> = {}
  if (data.x != null) s.left = `${data.x}px`
  if (data.y != null) s.top = `${data.y}px`
  s[arrowStaticSide.value] = '-4px'
  return s
})
</script>

<template>
  <span class="relative inline-flex">
    <!-- Trigger -->
    <span
      ref="triggerRef"
      class="inline-flex"
      :aria-describedby="isOpen ? tooltipId : undefined"
      @mouseenter="show"
      @mouseleave="hide"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <slot />
    </span>

    <!-- Tooltip -->
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
            :class="cn(tooltipTheme, props.class)"
            :initial="enterAnimation"
            :animate="{ opacity: 1, scale: 1, x: 0, y: 0 }"
            :exit="{ opacity: 0, scale: 0.95 }"
            :transition="{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }"
          >
            {{ content }}

            <!-- Arrow -->
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
  </span>
</template>
