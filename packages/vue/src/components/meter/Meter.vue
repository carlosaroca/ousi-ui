<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import {
  meterTheme,
  meterTrackTheme,
  meterFillTheme,
  meterLabelTheme,
  meterOutputTheme,
} from './meter.theme'
import type { MeterProps, MeterColor } from './meter.types'

const props = withDefaults(defineProps<MeterProps>(), {
  minValue: 0,
  maxValue: 100,
  color: 'accent',
  size: 'md',
  showValueLabel: false,
  autoColor: false,
  disabled: false,
})

const percentage = computed(() => {
  const clamped = Math.min(Math.max(props.value, props.minValue), props.maxValue)
  return ((clamped - props.minValue) / (props.maxValue - props.minValue)) * 100
})

const lowThreshold = computed(() =>
  props.low ?? props.minValue + (props.maxValue - props.minValue) * 0.25,
)

const highThreshold = computed(() =>
  props.high ?? props.minValue + (props.maxValue - props.minValue) * 0.75,
)

const resolvedColor = computed((): MeterColor => {
  if (!props.autoColor) return props.color!

  const val = props.value
  const optimum = props.optimum ?? props.maxValue
  const isHighOptimum = optimum >= highThreshold.value

  if (isHighOptimum) {
    if (val >= highThreshold.value) return 'success'
    if (val >= lowThreshold.value) return 'warning'
    return 'danger'
  } else {
    if (val <= lowThreshold.value) return 'success'
    if (val <= highThreshold.value) return 'warning'
    return 'danger'
  }
})

const valueLabel = computed(() => {
  if (props.formatOptions) {
    return new Intl.NumberFormat(undefined, props.formatOptions).format(props.value)
  }
  return `${Math.round(percentage.value)}%`
})
</script>

<template>
  <div
    :class="cn(meterTheme({ disabled }), props.class)"
    role="meter"
    :aria-valuenow="value"
    :aria-valuemin="minValue"
    :aria-valuemax="maxValue"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    :data-disabled="disabled || undefined"
  >
    <span v-if="label" :class="meterLabelTheme">{{ label }}</span>

    <output v-if="showValueLabel" :class="meterOutputTheme">
      {{ valueLabel }}
    </output>

    <div :class="meterTrackTheme({ size })">
      <div
        :class="meterFillTheme({ color: resolvedColor })"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
