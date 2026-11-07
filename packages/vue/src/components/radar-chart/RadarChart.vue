<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { chartGridColor, resolveChartColor, useChartMotion, useFocus, useRoving } from '../chart-shared'
import type { RadarAxisItem, RadarChartProps, RadarChartSlots } from './radar-chart.types'

const props = withDefaults(defineProps<RadarChartProps>(), {
  labelKey: 'label',
  variant: 'filled',
  rings: 4,
  size: 240,
  alertBelow: 0,
  showLabels: true,
  interactive: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [index: number | null]
  'axis-enter': [axis: RadarAxisItem, event: Event]
  'axis-leave': [axis: RadarAxisItem, event: Event]
  'axis-click': [axis: RadarAxisItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.data.length)
defineSlots<RadarChartSlots>()

const { mounted, motion } = useChartMotion(() => props.animated)

// Room around the polygon for the labels
const margin = computed(() => (props.showLabels ? (props.variant === 'score' ? 64 : 52) : 16))
const box = computed(() => props.size + margin.value * 2)
const c = computed(() => box.value / 2)
const R = computed(() => props.size / 2)

const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0)
const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()

const resolved = computed(() =>
  props.series.map((s, i) => ({ ...s, label: s.label ?? s.key, color: resolveChartColor(s.color, i) })),
)
const maxValue = computed(
  () => props.max ?? Math.max(...props.data.flatMap((d) => props.series.map((s) => num(d[s.key]))), 1),
)

const count = computed(() => props.data.length)
const angle = (i: number) => (-90 + (i * 360) / Math.max(count.value, 1)) * (Math.PI / 180)
const at = (i: number, r: number): [number, number] => [c.value + Math.cos(angle(i)) * r, c.value + Math.sin(angle(i)) * r]

const axes = computed<RadarAxisItem[]>(() =>
  props.data.map((datum, index) => {
    const values = resolved.value.map((s) => ({
      key: s.key,
      label: s.label,
      value: num(datum[s.key]),
      formatted: fmt(num(datum[s.key])),
      color: s.color,
    }))
    return {
      index,
      datum,
      label: String(datum[props.labelKey] ?? ''),
      values,
      average: values.length ? values.reduce((t, v) => t + v.value, 0) / values.length : 0,
    }
  }),
)

const gridPolys = computed(() =>
  Array.from({ length: props.rings }, (_, k) => {
    const r = (R.value * (k + 1)) / props.rings
    return axes.value.map((_, i) => at(i, r).join(',')).join(' ')
  }),
)

const polys = computed(() =>
  resolved.value.map((s, si) => {
    const pts = axes.value.map((a) => at(a.index, (Math.min(a.values[si].value, maxValue.value) / maxValue.value) * R.value))
    return { color: s.color, key: s.key, pts, d: pts.map((p) => p.join(',')).join(' ') }
  }),
)

const focusedAxis = computed(() => (focused.value == null ? null : axes.value[focused.value] ?? null))
const overall = computed(() => (axes.value.length ? axes.value.reduce((t, a) => t + a.average, 0) / axes.value.length : 0))

function labelPos(i: number) {
  const [x, y] = at(i, R.value + 14)
  const cos = Math.cos(angle(i))
  const sin = Math.sin(angle(i))
  return {
    x,
    y,
    anchor: Math.abs(cos) < 0.25 ? 'middle' : cos > 0 ? 'start' : 'end',
    dy: sin > 0.5 ? 10 : sin < -0.5 ? -4 : 4,
  }
}

function enter(a: RadarAxisItem, e: Event) {
  if (!props.interactive) return
  setFocused(a.index)
  emit('axis-enter', a, e)
}
function leave(a: RadarAxisItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('axis-leave', a, e)
}
function click(a: RadarAxisItem, e: Event) {
  if (props.interactive) emit('axis-click', a, e)
}

const isAlert = (a: RadarAxisItem) => props.variant === 'score' && props.alertBelow > 0 && a.average < props.alertBelow
const fillOn = computed(() => props.variant !== 'lines')
const ariaLabel = computed(
  () => props.label ?? axes.value.map((a) => `${a.label} ${a.values.map((v) => v.formatted).join('/')}`).join(', '),
)
</script>

<template>
  <div data-roving-root :class="cn('relative inline-block max-w-full select-none align-top', props.class)">
    <svg :width="box" :height="box" :viewBox="`0 0 ${box} ${box}`" class="block h-auto max-w-full overflow-visible" role="group" :aria-label="ariaLabel">
      <!-- Grid -->
      <g aria-hidden="true" fill="none" :stroke="chartGridColor">
        <polygon v-for="(p, k) in gridPolys" :key="k" :points="p" />
        <line v-for="a in axes" :key="a.index" :x1="c" :y1="c" :x2="at(a.index, R)[0]" :y2="at(a.index, R)[1]" />
      </g>

      <!-- Highlighted axis -->
      <line
        v-if="focusedAxis"
        :x1="c" :y1="c" :x2="at(focusedAxis.index, R)[0]" :y2="at(focusedAxis.index, R)[1]"
        stroke="color-mix(in srgb, var(--ousi-foreground) 30%, transparent)" stroke-dasharray="3 3"
      />

      <!-- Series -->
      <g
        :style="{
          transformOrigin: `${c}px ${c}px`,
          transform: `scale(${mounted ? 1 : 0.2})`,
          opacity: mounted ? 1 : 0,
          transition: motion ? 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease-out' : 'none',
        }"
      >
        <polygon
          v-for="p in polys" :key="p.key" :points="p.d"
          :fill="fillOn ? p.color : 'none'" :fill-opacity="fillOn ? 0.2 : 0"
          :stroke="p.color" stroke-width="2" stroke-linejoin="round"
        />
        <template v-if="variant === 'dots' || variant === 'score'">
          <g v-for="p in polys" :key="`d-${p.key}`" class="pointer-events-none">
            <circle
              v-for="(pt, i) in p.pts" :key="i" :cx="pt[0]" :cy="pt[1]" :r="focused === i ? 5 : 3.5"
              :fill="p.color" stroke="var(--ousi-background)" stroke-width="2"
              style="transition: r 150ms ease-out"
            />
          </g>
        </template>
      </g>

      <!-- Active points -->
      <template v-if="focusedAxis">
        <g v-for="p in polys" :key="`f-${p.key}`" class="pointer-events-none">
          <circle :cx="p.pts[focusedAxis.index][0]" :cy="p.pts[focusedAxis.index][1]" r="5" :fill="p.color" class="radar-pulse" />
          <circle
            v-if="variant !== 'dots' && variant !== 'score'"
            :cx="p.pts[focusedAxis.index][0]" :cy="p.pts[focusedAxis.index][1]" r="5"
            :fill="p.color" stroke="var(--ousi-background)" stroke-width="2"
          />
        </g>
      </template>

      <!-- Labels -->
      <g v-if="showLabels" class="pointer-events-none">
        <text
          v-for="a in axes" :key="a.index"
          :x="labelPos(a.index).x" :y="labelPos(a.index).y + labelPos(a.index).dy"
          :text-anchor="labelPos(a.index).anchor"
          class="text-[11px] transition-colors"
          :class="focused === a.index ? 'fill-ousi-foreground' : 'fill-ousi-muted'"
        >
          {{ a.label }}
          <tspan
            v-if="variant === 'score'"
            class="font-semibold tabular-nums"
            :style="{ fill: isAlert(a) ? 'var(--ousi-danger)' : 'var(--ousi-foreground)' }"
            dx="4"
          >{{ fmt(Math.round(a.average)) }}</tspan>
        </text>
      </g>

      <!-- Hit areas -->
      <g v-if="interactive">
        <line
          v-for="a in axes" :key="`h-${a.index}`"
          :x1="c" :y1="c" :x2="at(a.index, R + 26)[0]" :y2="at(a.index, R + 26)[1]"
          stroke="transparent" stroke-width="36" stroke-linecap="round"
          class="cursor-pointer outline-none" :tabindex="roving.tabindexFor(a.index, true)" :data-roving="a.index" @focusin="roving.activate(a.index)" @keydown="roving.onKeydown($event, a.index)" role="img"
          :aria-label="`${a.label}: ${a.values.map((v) => `${v.label} ${v.formatted}`).join(', ')}`"
          @mouseenter="enter(a, $event)" @mouseleave="leave(a, $event)"
          @focus="enter(a, $event)" @blur="leave(a, $event)"
          @click="click(a, $event)" @keydown.enter.prevent="click(a, $event)" @keydown.space.prevent="click(a, $event)"
        />
      </g>
    </svg>

    <div
      v-if="$slots.center || variant === 'score'"
      class="pointer-events-none absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ousi-background text-center shadow-md"
    >
      <slot name="center" :average="overall" :focused-axis="focusedAxis">
        <span class="text-lg font-semibold tabular-nums text-ousi-foreground">{{ fmt(Math.round(focusedAxis ? focusedAxis.average : overall)) }}</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.radar-pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: radar-ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes radar-ping {
  0% { transform: scale(1); opacity: 0.5; }
  80%, 100% { transform: scale(2.6); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .radar-pulse { animation: none; opacity: 0; }
}
</style>
