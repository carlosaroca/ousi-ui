<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@ousi-ui/core'
import { scrollShadowTheme } from './scroll-shadow.theme'
import { useScrollFade } from './useScrollFade'
import type { ScrollShadowProps } from './scroll-shadow.types'

const props = withDefaults(defineProps<ScrollShadowProps>(), {
  orientation: 'vertical',
  size: 40,
  hideScrollbar: true,
  offset: 0,
})

const containerRef = ref<HTMLElement | null>(null)
const { maskStyle } = useScrollFade(containerRef, {
  orientation: () => props.orientation,
  size: () => props.size,
  offset: () => props.offset,
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
