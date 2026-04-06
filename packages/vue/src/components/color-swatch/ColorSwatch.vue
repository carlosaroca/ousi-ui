<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { colorSwatchSizes, colorSwatchShapes } from './color-swatch.theme'
import type { ColorSwatchProps } from './color-swatch.types'

const props = withDefaults(defineProps<ColorSwatchProps>(), {
  shape: 'square',
  size: 'md',
})

const swatchStyle = computed(() => ({
  background: `linear-gradient(${props.color}, ${props.color}), repeating-conic-gradient(#efefef 0% 25%, #f7f7f7 0% 50%) 50% / 16px 16px`,
  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
}))
</script>

<template>
  <span
    :class="cn('relative box-border shrink-0', colorSwatchSizes[size], colorSwatchShapes[shape], props.class)"
    :style="swatchStyle"
    :aria-label="color"
    :title="color"
    role="img"
  />
</template>
