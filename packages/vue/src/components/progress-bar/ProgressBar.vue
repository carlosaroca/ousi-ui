<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { cn, useMounted } from '@ousi-ui/core'
import { progressBarSizes, progressBarColors } from './progress-bar.theme'
import type { ProgressBarProps } from './progress-bar.types'

const props = withDefaults(defineProps<ProgressBarProps>(), {
  minValue: 0,
  maxValue: 100,
  color: 'accent',
  size: 'md',
  showValueLabel: false,
  disabled: false,
})

const isIndeterminate = computed(() => props.value === undefined || props.value === null)

const percentage = computed(() => {
  if (isIndeterminate.value) return 0
  const val = Math.min(Math.max(props.value!, props.minValue), props.maxValue)
  return ((val - props.minValue) / (props.maxValue - props.minValue)) * 100
})

const valueLabel = computed(() => {
  if (isIndeterminate.value) return ''
  if (props.formatOptions) {
    return new Intl.NumberFormat(undefined, props.formatOptions).format(props.value!)
  }
  return `${Math.round(percentage.value)}%`
})

// Indeterminate animation via JS (avoids CSS keyframe tree-shaking issues)
const isMounted = useMounted()
const indeterminatePos = ref(-40)
let animFrame: number | null = null
let lastTime = 0

function animateIndeterminate(time: number) {
  if (!lastTime) lastTime = time
  const delta = time - lastTime
  lastTime = time

  // Move from -40% to 100% over 1.5s, then reset
  indeterminatePos.value += (delta / 1500) * 140
  if (indeterminatePos.value > 100) {
    indeterminatePos.value = -40
  }

  animFrame = requestAnimationFrame(animateIndeterminate)
}

watch([isIndeterminate, isMounted], ([indeterminate, mounted]) => {
  if (indeterminate && mounted) {
    lastTime = 0
    indeterminatePos.value = -40
    animFrame = requestAnimationFrame(animateIndeterminate)
  } else if (animFrame) {
    cancelAnimationFrame(animFrame)
    animFrame = null
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})

const fillStyle = computed(() => {
  if (isIndeterminate.value) {
    return {
      width: '40%',
      left: `${indeterminatePos.value}%`,
    }
  }
  return {
    width: `${percentage.value}%`,
    transition: 'width 300ms ease-out',
  }
})
</script>

<template>
  <div
    :class="cn('flex w-full flex-col gap-1', disabled && 'opacity-50 pointer-events-none', props.class)"
    role="progressbar"
    :aria-valuenow="isIndeterminate ? undefined : props.value"
    :aria-valuemin="minValue"
    :aria-valuemax="maxValue"
    :aria-label="label"
  >
    <!-- Label row -->
    <div v-if="label || (showValueLabel && !isIndeterminate)" class="flex items-center justify-between">
      <span v-if="label" class="text-sm font-medium text-ousi-foreground">{{ label }}</span>
      <output v-if="showValueLabel && !isIndeterminate" class="text-sm font-medium tabular-nums text-ousi-foreground">
        {{ valueLabel }}
      </output>
    </div>

    <!-- Track -->
    <div :class="cn('relative overflow-hidden rounded-full bg-ousi-default', progressBarSizes[size])">
      <!-- Fill -->
      <div
        :class="cn('absolute top-0 h-full rounded-full', progressBarColors[color])"
        :style="fillStyle"
      />
    </div>
  </div>
</template>
