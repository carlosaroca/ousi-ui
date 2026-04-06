<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { cn } from '@ousi-ui/core'
import type { MarqueeProps } from './marquee.types'

const props = withDefaults(defineProps<MarqueeProps>(), {
  direction: 'left',
  speed: 30,
  pauseOnHover: false,
  gap: 16,
})

const isVertical = computed(() => props.direction === 'up' || props.direction === 'down')
const isReverse = computed(() => props.direction === 'right' || props.direction === 'down')

const trackStyle = computed(() => ({
  display: 'flex',
  flexDirection: (isVertical.value ? 'column' : 'row') as 'column' | 'row',
  gap: `${props.gap}px`,
}))

const copyStyle = computed(() => ({
  display: 'flex',
  flexDirection: (isVertical.value ? 'column' : 'row') as 'column' | 'row',
  flexShrink: 0,
  gap: `${props.gap}px`,
  alignItems: 'center' as const,
}))

const paused = ref(false)

function onEnter() {
  if (props.pauseOnHover) paused.value = true
}

function onLeave() {
  if (props.pauseOnHover) paused.value = false
}

const trackRef = ref<HTMLElement | null>(null)
let anim: Animation | null = null

onMounted(() => {
  const el = trackRef.value
  if (!el) return

  const axis = isVertical.value ? 'translateY' : 'translateX'

  anim = el.animate(
    [
      { transform: `${axis}(0)` },
      { transform: `${axis}(-50%)` },
    ],
    {
      duration: props.speed * 1000,
      iterations: Infinity,
      direction: isReverse.value ? 'reverse' : 'normal',
      easing: 'linear',
    },
  )
})

watch(paused, (p) => {
  if (anim) anim.playbackRate = p ? 0 : 1
})
</script>

<template>
  <div
    :class="cn('overflow-hidden', props.class)"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div ref="trackRef" :style="trackStyle">
      <div :style="copyStyle">
        <slot />
      </div>
      <div :style="copyStyle" aria-hidden="true">
        <slot />
      </div>
    </div>
  </div>
</template>
