<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@ousi-ui/core'
import { resolveChartColor, useChartMotion, useElementWidth, useFocus, useRoving, visibleLabels } from '../chart-shared'
import type { DotMatrixItem, DotMatrixProps, DotMatrixSlots } from './dot-matrix.types'

const props = withDefaults(defineProps<DotMatrixProps>(), {
  rows: 5,
  color: 'accent',
  emptyColor: 'var(--ousi-default)',
  shape: 'circle',
  dotSize: 16,
  gap: 8,
  partial: false,
  align: 'center',
  showLabels: false,
  interactive: true,
  tooltip: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [index: number | null]
  'column-enter': [item: DotMatrixItem, event: Event]
  'column-leave': [item: DotMatrixItem, event: Event]
  'column-click': [item: DotMatrixItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.data.length)
defineSlots<DotMatrixSlots>()

const root = ref<HTMLElement | null>(null)
const width = useElementWidth(root)
const { mounted, motion } = useChartMotion(() => props.animated)

const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()
const maxValue = computed(() => props.max ?? Math.max(...props.data.map((d) => d.value), 1))

const n = computed(() => Math.max(props.data.length, 1))
// When the width is tight the gap yields before the dots do: it never exceeds 60% of a dot.
const GAP_RATIO = 0.6
const fitFull = computed(() => (width.value - (n.value - 1) * props.gap) / n.value)
const fitTight = computed(() => width.value / (n.value + (n.value - 1) * GAP_RATIO))
const d = computed(() => Math.max(Math.min(props.dotSize, Math.max(fitFull.value, fitTight.value)), 2))
const gapPx = computed(() => (d.value < props.dotSize ? Math.min(props.gap, d.value * GAP_RATIO) : props.gap))
const stepX = computed(() => d.value + gapPx.value)
const matrixW = computed(() => n.value * d.value + (n.value - 1) * gapPx.value)
const originX = computed(() => (props.align === 'center' ? Math.max((width.value - matrixW.value) / 2, 0) : 0))
const labelH = computed(() => (props.showLabels ? 22 : 0))
const height = computed(() => props.rows * d.value + (props.rows - 1) * gapPx.value + labelH.value)

const items = computed<DotMatrixItem[]>(() =>
  props.data.map((datum, index) => {
    const ratio = Math.min(Math.max(datum.value / maxValue.value, 0), 1)
    const exact = ratio * props.rows
    return {
      index,
      datum,
      label: datum.label ?? String(index + 1),
      value: datum.value,
      filled: props.partial ? exact : Math.round(exact),
      percent: Math.round(ratio * 100),
      color: resolveChartColor(datum.color ?? props.color, 0),
      formatted: fmt(datum.value),
      x: originX.value + index * stepX.value + d.value / 2,
    }
  }),
)

// Row 0 is the bottom one
const cy = (row: number) => (props.rows - 1 - row) * stepX.value + d.value / 2

/** 0 = empty, 1 = full, in between = partial dot. */
function fillOf(it: DotMatrixItem, row: number) {
  return Math.min(Math.max(it.filled - row, 0), 1)
}
function dotSizeOf(it: DotMatrixItem, row: number) {
  const base = d.value * Math.min(Math.max(it.datum.scale ?? 1, 0), 1)
  const f = fillOf(it, row)
  return f > 0 && f < 1 ? base * (0.35 + 0.65 * f) : base
}

// Column labels that fit: thinned out on narrow screens instead of piling up
const showLabel = computed(() => visibleLabels(items.value.map((i) => i.label), items.value.map((i) => i.x)))

const rx = computed(() => (props.shape === 'circle' ? 1 : props.shape === 'rounded' ? 0.3 : 0))
const isDimmed = (i: number) => focused.value != null && focused.value !== i

function enter(it: DotMatrixItem, e: Event) {
  if (!props.interactive) return
  setFocused(it.index)
  emit('column-enter', it, e)
}
function leave(it: DotMatrixItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('column-leave', it, e)
}
function click(it: DotMatrixItem, e: Event) {
  if (props.interactive) emit('column-click', it, e)
}

const focusedItem = computed(() => (focused.value == null ? null : items.value[focused.value] ?? null))
const tooltipStyle = computed(() => {
  const it = focusedItem.value
  if (!it) return {}
  const edge = 70
  const align = it.x < edge ? '0%' : it.x > width.value - edge ? '-100%' : '-50%'
  return { left: `${it.x}px`, top: '-8px', transform: `translate(${align}, -100%)` }
})

const ariaLabel = computed(() => props.label ?? `Dot matrix with ${props.data.length} columns`)
</script>

<template>
  <div data-roving-root ref="root" :class="cn('relative w-full min-w-0 max-w-full select-none', props.class)" :style="{ height: `${height}px` }" role="group" :aria-label="ariaLabel">
    <svg width="100%" :height="height" class="block overflow-visible">
      <g
        v-for="it in items"
        :key="it.index"
        :style="{ opacity: isDimmed(it.index) ? 0.3 : 1, transition: 'opacity 200ms ease-out' }"
      >
        <template v-for="row in rows" :key="row">
          <rect
            :x="it.x - dotSizeOf(it, row - 1) / 2"
            :y="cy(row - 1) - dotSizeOf(it, row - 1) / 2"
            :width="dotSizeOf(it, row - 1)"
            :height="dotSizeOf(it, row - 1)"
            :rx="(dotSizeOf(it, row - 1) / 2) * (rx === 1 ? 1 : rx * 2)"
            :fill="fillOf(it, row - 1) > 0 ? it.color : emptyColor"
            :style="{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              transform: `scale(${mounted ? 1 : 0})`,
              transition: motion
                ? `transform 450ms cubic-bezier(0.22, 1, 0.36, 1) ${it.index * 28 + (row - 1) * 45}ms`
                : 'none',
            }"
          />
        </template>
        <text
          v-if="showLabels && showLabel[it.index]"
          :x="it.x" :y="height - 6" text-anchor="middle"
          class="text-[11px] transition-colors"
          :class="focused === it.index ? 'fill-ousi-foreground' : 'fill-ousi-muted'"
        >{{ it.label }}</text>
      </g>

      <!-- Hit areas -->
      <g v-if="interactive">
        <rect
          v-for="it in items" :key="`h-${it.index}`"
          :x="it.x - stepX / 2" :y="0" :width="stepX" :height="height"
          fill="transparent" class="cursor-pointer outline-none" :tabindex="roving.tabindexFor(it.index, true)" :data-roving="it.index" @focusin="roving.activate(it.index)" @keydown="roving.onKeydown($event, it.index)" role="img"
          :aria-label="`${it.label}: ${it.formatted}`"
          @mouseenter="enter(it, $event)" @mouseleave="leave(it, $event)"
          @focus="enter(it, $event)" @blur="leave(it, $event)"
          @click="click(it, $event)" @keydown.enter.prevent="click(it, $event)" @keydown.space.prevent="click(it, $event)"
        />
      </g>
    </svg>

    <div
      v-if="tooltip && focusedItem"
      class="pointer-events-none absolute z-10 w-max rounded-xl border border-ousi-border bg-ousi-overlay px-3 py-1.5 text-xs shadow-lg"
      :style="tooltipStyle"
    >
      <slot name="tooltip" :item="focusedItem">
        <span class="text-ousi-muted">{{ focusedItem.label }}</span>
        <span class="ml-2 font-semibold tabular-nums text-ousi-foreground">{{ focusedItem.formatted }}</span>
      </slot>
    </div>
  </div>
</template>
