<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { cn } from '@ousi-ui/core'
import { scrollShadowTheme } from './scroll-shadow.theme'
import type { ScrollShadowProps } from './scroll-shadow.types'

const props = withDefaults(defineProps<ScrollShadowProps>(), {
  orientation: 'vertical',
  size: 40,
  hideScrollbar: true,
  offset: 0,
})

const containerRef = ref<HTMLElement | null>(null)

const hasTopScroll = ref(false)
const hasBottomScroll = ref(false)
const hasLeftScroll = ref(false)
const hasRightScroll = ref(false)

function checkScroll() {
  const el = containerRef.value
  if (!el) return

  const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el
  const o = props.offset

  if (props.orientation === 'vertical' || props.orientation === 'both') {
    hasTopScroll.value = scrollTop > o
    hasBottomScroll.value = scrollTop < scrollHeight - clientHeight - o
  }

  if (props.orientation === 'horizontal' || props.orientation === 'both') {
    hasLeftScroll.value = scrollLeft > o
    hasRightScroll.value = scrollLeft < scrollWidth - clientWidth - o
  }
}

// Mask style — CSS mask-image with linear-gradient
const maskStyle = computed(() => {
  const s = props.size
  const isV = props.orientation === 'vertical' || props.orientation === 'both'
  const isH = props.orientation === 'horizontal' || props.orientation === 'both'

  const top = isV && hasTopScroll.value
  const bottom = isV && hasBottomScroll.value
  const left = isH && hasLeftScroll.value
  const right = isH && hasRightScroll.value

  // No mask needed if no scroll in any direction
  if (!top && !bottom && !left && !right) return {}

  const masks: string[] = []

  // Vertical mask
  if (isV) {
    if (top && bottom) {
      masks.push(`linear-gradient(to bottom, transparent, #000 ${s}px, #000 calc(100% - ${s}px), transparent)`)
    } else if (top) {
      masks.push(`linear-gradient(to bottom, transparent, #000 ${s}px)`)
    } else if (bottom) {
      masks.push(`linear-gradient(to bottom, #000 calc(100% - ${s}px), transparent)`)
    }
  }

  // Horizontal mask
  if (isH) {
    if (left && right) {
      masks.push(`linear-gradient(to right, transparent, #000 ${s}px, #000 calc(100% - ${s}px), transparent)`)
    } else if (left) {
      masks.push(`linear-gradient(to right, transparent, #000 ${s}px)`)
    } else if (right) {
      masks.push(`linear-gradient(to right, #000 calc(100% - ${s}px), transparent)`)
    }
  }

  if (masks.length === 0) return {}

  // When both orientations have masks, use mask-composite: intersect
  const maskImage = masks.join(', ')

  return {
    maskImage,
    WebkitMaskImage: maskImage,
    ...(masks.length > 1 ? {
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    } : {}),
  }
})

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const el = containerRef.value
  if (!el) return

  checkScroll()
  el.addEventListener('scroll', checkScroll, { passive: true })

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(el)
  }
})

onBeforeUnmount(() => {
  containerRef.value?.removeEventListener('scroll', checkScroll)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    ref="containerRef"
    :class="cn(scrollShadowTheme({ orientation, hideScrollbar }), props.class)"
    :style="[maskStyle, props.style]"
  >
    <slot />
  </div>
</template>
