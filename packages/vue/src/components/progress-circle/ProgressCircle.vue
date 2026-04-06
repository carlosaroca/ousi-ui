<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import {
  progressCircleSizes,
  progressCircleStrokeColors,
  progressCircleTrackColor,
} from './progress-circle.theme'
import type { ProgressCircleProps } from './progress-circle.types'

const props = withDefaults(defineProps<ProgressCircleProps>(), {
  minValue: 0,
  maxValue: 100,
  color: 'accent',
  size: 'md',
  strokeWidth: 3.8,
  showValueLabel: false,
  disabled: false,
})

const isIndeterminate = computed(() => props.value === undefined || props.value === null)

const percentage = computed(() => {
  if (isIndeterminate.value) return 25
  const val = Math.min(Math.max(props.value!, props.minValue), props.maxValue)
  return ((val - props.minValue) / (props.maxValue - props.minValue)) * 100
})

const RADIUS = 15.915
const CIRCUMFERENCE = 100

const strokeDashoffset = computed(() => CIRCUMFERENCE - percentage.value)

const valueLabel = computed(() => {
  if (isIndeterminate.value) return ''
  return `${Math.round(percentage.value)}%`
})

const fillStroke = computed(() => progressCircleStrokeColors[props.color] ?? progressCircleStrokeColors.accent)
</script>

<template>
  <div
    :class="cn('relative inline-flex items-center justify-center', disabled && 'opacity-50', props.class)"
    role="progressbar"
    :aria-valuenow="isIndeterminate ? undefined : props.value"
    :aria-valuemin="minValue"
    :aria-valuemax="maxValue"
    :aria-label="label ?? (isIndeterminate ? 'Loading' : `${valueLabel} complete`)"
  >
    <svg
      :class="cn(progressCircleSizes[size], '-rotate-90')"
      :style="isIndeterminate ? { animation: 'spin 1s linear infinite' } : {}"
      viewBox="0 0 36 36"
      fill="none"
    >
      <!-- Track -->
      <circle
        cx="18" cy="18" :r="RADIUS"
        :stroke="progressCircleTrackColor"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <!-- Fill -->
      <circle
        cx="18" cy="18" :r="RADIUS"
        :stroke="fillStroke"
        :stroke-width="strokeWidth"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="strokeDashoffset"
        :style="!isIndeterminate ? { transition: 'stroke-dashoffset 300ms ease-out' } : {}"
      />
    </svg>

    <!-- Value label -->
    <span
      v-if="showValueLabel && !isIndeterminate"
      class="absolute inset-0 flex items-center justify-center font-medium tabular-nums text-ousi-foreground"
      :class="{ 'text-[8px]': size === 'sm', 'text-[10px]': size === 'md', 'text-xs': size === 'lg' }"
      aria-hidden="true"
    >
      {{ valueLabel }}
    </span>

    <!-- Custom center content -->
    <span
      v-else-if="$slots.default"
      class="absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <slot />
    </span>
  </div>
</template>
