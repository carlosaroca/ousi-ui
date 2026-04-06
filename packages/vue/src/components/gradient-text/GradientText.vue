<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { cn } from '@ousi-ui/core'
import type { GradientTextProps, GradientTextPreset } from './gradient-text.types'
import { gradientTextTheme } from './gradient-text.theme'

const props = withDefaults(defineProps<GradientTextProps>(), {
  animate: false,
  duration: 3,
})

const elRef = ref<HTMLElement | null>(null)
let animation: Animation | null = null

const presetColors: Record<GradientTextPreset, [string, string, string]> = {
  aurora: ['#6366f1', '#8b5cf6', '#ec4899'],
  sunset: ['#f97316', '#ef4444', '#ec4899'],
  ocean: ['#06b6d4', '#3b82f6', '#8b5cf6'],
  candy: ['#f472b6', '#fb923c', '#fbbf24'],
  neon: ['#22d3ee', '#a855f7', '#f43f5e'],
}

const gradientColors = computed(() => {
  if (props.from || props.to) {
    const from = props.from || '#000'
    const to = props.to || '#000'
    const via = props.via
    return via ? [from, via, to] : [from, to]
  }
  if (props.preset && presetColors[props.preset]) {
    return presetColors[props.preset]
  }
  return presetColors.aurora
})

const gradientStyle = computed(() => {
  const colors = (gradientColors.value || presetColors.aurora).join(', ')
  const style: Record<string, string> = {
    backgroundImage: `linear-gradient(to right, ${colors})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  }
  if (props.animate) {
    style.backgroundSize = '200% auto'
  }
  return style
})

function startAnimation() {
  stopAnimation()
  if (!props.animate || !elRef.value) return
  animation = elRef.value.animate(
    [
      { backgroundPosition: '0% center' },
      { backgroundPosition: '-200% center' },
    ],
    {
      duration: props.duration * 1000,
      iterations: Infinity,
      easing: 'linear',
    },
  )
}

function stopAnimation() {
  if (animation) {
    animation.cancel()
    animation = null
  }
}

onMounted(() => {
  if (props.animate) {
    startAnimation()
  }
})

watch(() => props.animate, (val) => {
  if (val) startAnimation()
  else stopAnimation()
})

watch(() => props.duration, () => {
  if (props.animate) startAnimation()
})

onBeforeUnmount(() => {
  stopAnimation()
})
</script>

<template>
  <span
    ref="elRef"
    :class="cn(gradientTextTheme, props.class)"
    :style="gradientStyle"
  >
    <slot />
  </span>
</template>
