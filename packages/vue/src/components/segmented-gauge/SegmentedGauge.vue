<script setup lang="ts">
import { computed, useId } from 'vue'
import { cn } from '@ousi-ui/core'
import { jointedArcs, resolveChartColor, useChartMotion, useFocus } from '../chart-shared'
import type { GaugeItem, SegmentedGaugeProps, SegmentedGaugeSlots } from './segmented-gauge.types'

const props = withDefaults(defineProps<SegmentedGaugeProps>(), {
  size: 200,
  strokeWidth: 10,
  sweep: 270,
  gap: 2,
  joined: false,
  interactive: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [index: number | null]
  'segment-enter': [item: GaugeItem, event: Event]
  'segment-leave': [item: GaugeItem, event: Event]
  'segment-click': [item: GaugeItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
defineSlots<SegmentedGaugeSlots>()

const { mounted, motion } = useChartMotion(() => props.animated)

const R = computed(() => 50 - props.strokeWidth / 2 - 1)
const fullRing = computed(() => props.sweep >= 360)

const items = computed<GaugeItem[]>(() =>
  props.segments.map((s, index) => ({
    key: s.id ?? s.label,
    index,
    label: s.label,
    value: s.value,
    max: s.max,
    percent: Math.round((Math.min(Math.max(s.value / (s.max || 1), 0), 1)) * 100),
    color: resolveChartColor(s.color, index),
    valueLabel: s.valueLabel ?? String(s.value),
  })),
)

const total = computed(() => props.segments.reduce((t, s) => t + s.value, 0))
const maxTotal = computed(() => props.segments.reduce((t, s) => t + s.max, 0))

// Angles are in degrees, 0° at 3 o'clock, clockwise (SVG). The gauge opens at the bottom.
const start = computed(() => (fullRing.value ? -90 : 90 + (360 - props.sweep) / 2))
const arcs = computed(() =>
  jointedArcs({
    sizes: items.value.map((it) => Math.max(it.max, 0)),
    start: start.value,
    sweep: props.sweep,
    radius: R.value,
    thickness: props.strokeWidth,
    gap: props.gap,
    joined: props.joined,
  }),
)

// Clip paths are shared by id across the page.
const clipId = useId()

const focusedSegment = computed(() => (focused.value == null ? null : items.value[focused.value] ?? null))
const isDimmed = (i: number) => focused.value != null && focused.value !== i

function enter(it: GaugeItem, e: Event) {
  if (!props.interactive) return
  setFocused(it.index)
  emit('segment-enter', it, e)
}
function leave(it: GaugeItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('segment-leave', it, e)
}
function click(it: GaugeItem, e: Event) {
  if (props.interactive) emit('segment-click', it, e)
}

const ariaLabel = computed(() => props.label ?? items.value.map((i) => `${i.label} ${i.value} of ${i.max}`).join(', '))
</script>

<template>
  <div
    :class="cn('inline-block w-fit max-w-full align-top', props.class)"
    role="img"
    :aria-label="ariaLabel"
  >
    <!-- The box of the drawing: what sits in the middle is placed on it, however wide the root is. -->
    <div class="relative mx-auto w-fit max-w-full">
      <svg :width="size" :height="size" viewBox="0 0 100 100" class="block h-auto max-w-full" fill="none" aria-hidden="true">
        <g
          v-for="it in items"
          :key="it.key"
          :class="interactive && 'cursor-pointer'"
          :style="{ opacity: isDimmed(it.index) ? 0.3 : 1, transition: 'opacity 200ms ease-out' }"
          @mouseenter="enter(it, $event)"
          @mouseleave="leave(it, $event)"
          @click="click(it, $event)"
        >
          <template v-if="arcs[it.index]">
            <clipPath v-if="arcs[it.index]!.clip" :id="`${clipId}-${it.index}`">
              <path :d="arcs[it.index]!.clip" clip-rule="evenodd" />
            </clipPath>
            <path
              :clip-path="arcs[it.index]!.clip ? `url(#${clipId}-${it.index})` : undefined"
              data-part="track"
              :d="arcs[it.index]!.d"
              :stroke-width="strokeWidth"
              stroke-linecap="round"
              stroke="var(--ousi-default)"
            />
            <!-- Any value above zero shows, even one that rounds to 0%. The gap of the dash is longer
                 than the line, so no repeat of the dash shows as a second dot at its end. The line
                 stays and the offset moves, which is what animates a change of value. -->
            <path
              v-if="it.value > 0 && it.max > 0"
              :clip-path="arcs[it.index]!.clip ? `url(#${clipId}-${it.index})` : undefined"
              data-part="fill"
              :d="arcs[it.index]!.d"
              :stroke="it.color"
              :stroke-width="strokeWidth"
              stroke-linecap="round"
              pathLength="1"
              stroke-dasharray="1 2"
              :stroke-dashoffset="1 - (mounted ? Math.min(it.value / it.max, 1) : 0)"
              :style="{ transition: motion ? `stroke-dashoffset 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${it.index * 150}ms` : 'none' }"
            />
          </template>
        </g>
      </svg>

      <div v-if="$slots.default" class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <slot :total="total" :max="maxTotal" :focused-segment="focusedSegment" />
      </div>
    </div>
  </div>
</template>
