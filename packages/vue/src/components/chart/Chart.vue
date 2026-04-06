<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, useId } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn } from '@ousi-ui/core'
import { ChartEngine } from './chart.engine'
import type { ChartEngineConfig } from './chart.engine'
import { chartWindowButtonTheme } from './chart.theme'
import type { ChartProps, ChartEmits } from './chart.types'

const props = withDefaults(defineProps<ChartProps>(), {
  theme: 'dark',
  color: '#3b82f6',
  grid: true,
  badge: true,
  badgeVariant: 'default',
  badgeTail: true,
  fill: true,
  pulse: true,
  momentum: true,
  scrub: true,
  exaggerate: false,
  showValue: false,
  valueMomentumColor: false,
  degen: false,
  mode: 'line',
  candles: undefined,
  candleWidth: undefined,
  liveCandle: undefined,
  series: undefined,
  window: 30,
  windowStyle: 'default',
  tooltipY: 14,
  tooltipOutline: true,
  lerpSpeed: 0.08,
  cursor: 'crosshair',
  padding: () => ({ top: 12, right: 80, bottom: 28, left: 12 }),
  formatValue: (v: number) => v.toFixed(2),
  formatTime: undefined,
})

const emit = defineEmits<ChartEmits>()

const chartId = useId()
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const valueRef = ref<HTMLSpanElement | null>(null)

let engine: ChartEngine | null = null
const activeWindow = ref(props.window)

function buildConfig(): ChartEngineConfig {
  return {
    data: props.data,
    value: props.value,
    theme: props.theme,
    color: props.color,
    grid: props.grid,
    badge: props.badge,
    badgeVariant: props.badgeVariant,
    badgeTail: props.badgeTail,
    fill: props.fill,
    pulse: props.pulse,
    momentum: props.momentum,
    scrub: props.scrub,
    exaggerate: props.exaggerate,
    showValue: props.showValue,
    valueMomentumColor: props.valueMomentumColor,
    degen: props.degen,
    window: activeWindow.value,
    tooltipY: props.tooltipY,
    tooltipOutline: props.tooltipOutline,
    orderbook: props.orderbook,
    referenceLine: props.referenceLine,
    formatValue: props.formatValue,
    formatTime: props.formatTime,
    lerpSpeed: props.lerpSpeed,
    padding: props.padding,
    mode: props.mode ?? 'line',
    candles: props.candles,
    candleWidth: props.candleWidth,
    liveCandle: props.liveCandle,
    series: props.series,
  }
}

onMounted(() => {
  if (!canvasRef.value || !containerRef.value) return

  engine = new ChartEngine(canvasRef.value, containerRef.value, buildConfig())

  engine.setHoverCallback((point) => {
    emit('hover', point)
  })

  if (props.showValue && valueRef.value) {
    engine.setValueCallback((formatted) => {
      if (valueRef.value) valueRef.value.textContent = formatted
    })
  }

  if (props.degen) {
    engine.setDegenCallback((_direction) => {
      // Shake is handled inside the engine's canvas.
      // External animation (e.g. container shake via motion-v) can be added here.
    })
  }
})

watch(
  () => [
    props.data, props.value, props.theme, props.color,
    props.grid, props.badge, props.badgeVariant, props.badgeTail,
    props.fill, props.pulse, props.momentum, props.scrub,
    props.exaggerate, props.showValue, props.valueMomentumColor,
    props.degen, props.tooltipY, props.tooltipOutline,
    props.orderbook, props.referenceLine, props.formatValue,
    props.formatTime, props.lerpSpeed, props.padding,
    props.mode, props.candles, props.candleWidth, props.liveCandle,
    props.series,
    activeWindow.value,
  ],
  () => { engine?.update(buildConfig()) },
  { deep: true },
)

onUnmounted(() => {
  engine?.destroy()
  engine = null
})

function handleWindowChange(secs: number) {
  activeWindow.value = secs
  emit('window-change', secs)
}
</script>

<template>
  <div
    ref="containerRef"
    :id="chartId"
    :class="cn('relative w-full h-full overflow-hidden', props.class)"
    :style="{ cursor }"
  >
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" />

    <!-- showValue overlay: DOM span mutated directly by engine callback -->
    <span
      v-if="showValue"
      ref="valueRef"
      class="absolute top-3 left-3 text-2xl font-semibold tabular-nums pointer-events-none text-ousi-foreground"
      aria-live="off"
    />

    <!-- Window buttons -->
    <AnimatePresence>
      <Motion
        v-if="windows?.length"
        tag="div"
        class="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1"
        :initial="{ opacity: 0, y: 4 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 4 }"
        :transition="{ duration: 0.2 }"
      >
        <button
          v-for="w in windows"
          :key="w.secs"
          type="button"
          :class="chartWindowButtonTheme({ windowStyle, active: activeWindow === w.secs })"
          @click="handleWindowChange(w.secs)"
        >
          {{ w.label }}
        </button>
      </Motion>
    </AnimatePresence>
  </div>
</template>
