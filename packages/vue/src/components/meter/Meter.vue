<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { resolveChartColor } from '../chart-shared/palette'
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
  gap: 2,
  joined: false,
  showLegend: false,
})

const range = computed(() => props.maxValue - props.minValue)
const clamp = (n: number) => Math.min(Math.max(n, props.minValue), props.maxValue)
const format = (n: number) =>
  props.formatOptions ? new Intl.NumberFormat(undefined, props.formatOptions).format(n) : undefined

/* ── Segments ──────────────────────────────────────────────────── */

const parts = computed(() =>
  props.segments?.map((segment, index) => ({
    key: segment.id ?? segment.label,
    label: segment.label,
    value: Math.max(segment.value, 0),
    color: resolveChartColor(segment.color, index),
    formatted: format(segment.value) ?? segment.value.toLocaleString(),
  })),
)
const sum = computed(() => parts.value?.reduce((total, part) => total + part.value, 0) ?? 0)

// A bar of segments is a row that flexbox shares out: each grows by its value, and what is left of
// the range stays empty. Each is drawn as a pill that reaches one height past its share, under the
// round start of the next one, and has a ring cut out around that start to set the two apart.
const space = computed(() => (props.joined ? 0 : Math.max(props.gap, 0)))
const pieces = computed(() => {
  const shown = parts.value?.filter((part) => part.value > 0) ?? []
  // Out of 100: flexbox hands out only part of the room when the factors add up to less than 1.
  const unit = 100 / (Math.max(range.value, sum.value) || 1)
  const past = `calc(var(--meter-h) / 2 + ${space.value}px)`
  const cut = `radial-gradient(circle at calc(100% - var(--meter-h) / 2) 50%, transparent ${past}, #000 calc(var(--meter-h) / 2 + ${space.value + 0.5}px))`
  return {
    list: shown.map((part, i) => ({
      ...part,
      // The shortest still shows past the one that lies on it.
      slot: { flexGrow: part.value * unit, minWidth: past },
      mask: space.value > 0 && i < shown.length - 1 ? cut : undefined,
    })),
    rest: Math.max(range.value - sum.value, 0) * unit,
  }
})

/* ── Value ─────────────────────────────────────────────────────── */

const current = computed(() => (parts.value ? clamp(props.minValue + sum.value) : (props.value ?? props.minValue)))
const percentage = computed(() => ((clamp(current.value) - props.minValue) / range.value) * 100)
// For screen readers, which take a meter as a single thing: what it is made of, in words.
const breakdown = computed(() => parts.value?.map((part) => `${part.label}: ${part.formatted}`).join(', ') || undefined)

const lowThreshold = computed(() =>
  props.low ?? props.minValue + (props.maxValue - props.minValue) * 0.25,
)

const highThreshold = computed(() =>
  props.high ?? props.minValue + (props.maxValue - props.minValue) * 0.75,
)

const resolvedColor = computed((): MeterColor => {
  if (!props.autoColor) return props.color!

  const val = current.value
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
  // Segments that go over the range say so, past 100%.
  const total = parts.value ? props.minValue + sum.value : current.value
  const share = parts.value ? (sum.value / range.value) * 100 : percentage.value
  return format(total) ?? `${Math.round(share)}%`
})
</script>

<template>
  <div
    :class="cn(meterTheme({ disabled }), props.class)"
    role="meter"
    :aria-valuenow="clamp(current)"
    :aria-valuemin="minValue"
    :aria-valuemax="maxValue"
    :aria-label="label"
    :aria-valuetext="breakdown"
    :aria-disabled="disabled || undefined"
    :data-disabled="disabled || undefined"
  >
    <span v-if="label" :class="meterLabelTheme">{{ label }}</span>

    <output v-if="showValueLabel" :class="meterOutputTheme">
      {{ valueLabel }}
    </output>

    <div data-part="track" :class="meterTrackTheme({ size })">
      <div v-if="parts" class="absolute inset-0 flex pr-(--meter-h)">
        <div
          v-for="piece in pieces.list"
          :key="piece.key"
          data-part="slot"
          class="relative basis-0 transition-[flex-grow] duration-300 motion-reduce:transition-none"
          :style="piece.slot"
        >
          <div
            data-part="segment"
            class="absolute inset-y-0 left-0 w-[calc(100%+var(--meter-h))] rounded-full"
            :style="{ backgroundColor: piece.color, maskImage: piece.mask, WebkitMaskImage: piece.mask }"
            :title="`${piece.label}: ${piece.formatted}`"
          />
        </div>
        <div v-if="pieces.rest" data-part="rest" class="basis-0 transition-[flex-grow] duration-300 motion-reduce:transition-none" :style="{ flexGrow: pieces.rest }" />
      </div>
      <div
        v-else
        :class="meterFillTheme({ color: resolvedColor })"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <ul v-if="parts && showLegend" data-part="legend" class="col-span-full mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
      <li v-for="part in parts" :key="part.key" class="flex items-center gap-1.5 text-xs text-ousi-muted">
        <span class="size-2 shrink-0 rounded-full" :style="{ backgroundColor: part.color }" />
        {{ part.label }}
        <span class="font-medium tabular-nums text-ousi-foreground">{{ part.formatted }}</span>
      </li>
    </ul>
  </div>
</template>
