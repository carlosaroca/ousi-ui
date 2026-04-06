<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { colorSliderLabelTheme, colorSliderOutputTheme } from './color-slider.theme'
import { CHANNEL_RANGES } from './color-slider.types'
import type { ColorSliderProps, ColorSliderEmits } from './color-slider.types'

const props = withDefaults(defineProps<ColorSliderProps>(), {
  orientation: 'horizontal',
  showOutput: false,
  disabled: false,
})

const emit = defineEmits<ColorSliderEmits>()

const range = computed(() => CHANNEL_RANGES[props.channel])

const value = useControllableState<number>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? range.value.min,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const percentage = computed(() =>
  ((value.value - range.value.min) / (range.value.max - range.value.min)) * 100,
)

const trackGradient = computed(() => {
  const ctx = props.contextColor ?? {}
  const h = ctx.h ?? 0, s = ctx.s ?? 100, l = ctx.l ?? 50
  const r = ctx.r ?? 0, g = ctx.g ?? 0, b = ctx.b ?? 0
  const dir = props.orientation === 'horizontal' ? 'to right' : 'to top'

  switch (props.channel) {
    case 'hue':
      return `linear-gradient(${dir}, hsl(0,${s}%,${l}%), hsl(60,${s}%,${l}%), hsl(120,${s}%,${l}%), hsl(180,${s}%,${l}%), hsl(240,${s}%,${l}%), hsl(300,${s}%,${l}%), hsl(360,${s}%,${l}%))`
    case 'saturation':
      return `linear-gradient(${dir}, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%))`
    case 'lightness':
      return `linear-gradient(${dir}, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%))`
    case 'alpha':
      return `linear-gradient(${dir}, hsla(${h},${s}%,${l}%,0), hsla(${h},${s}%,${l}%,1))`
    case 'red':
      return `linear-gradient(${dir}, rgb(0,${g},${b}), rgb(255,${g},${b}))`
    case 'green':
      return `linear-gradient(${dir}, rgb(${r},0,${b}), rgb(${r},255,${b}))`
    case 'blue':
      return `linear-gradient(${dir}, rgb(${r},${g},0), rgb(${r},${g},255))`
    default:
      return `linear-gradient(${dir}, #000, #fff)`
  }
})

const trackBackground = computed(() => {
  if (props.channel === 'alpha') {
    return `${trackGradient.value}, repeating-conic-gradient(#efefef 0% 25%, #f7f7f7 0% 50%) 50% / 16px 16px`
  }
  return trackGradient.value
})

const thumbColor = computed(() => {
  const ctx = props.contextColor ?? {}
  const h = ctx.h ?? 0, s = ctx.s ?? 100, l = ctx.l ?? 50
  switch (props.channel) {
    case 'hue': return `hsl(${value.value}, ${s}%, ${l}%)`
    case 'saturation': return `hsl(${h}, ${value.value}%, ${l}%)`
    case 'lightness': return `hsl(${h}, ${s}%, ${value.value}%)`
    case 'alpha': return `hsla(${h}, ${s}%, ${l}%, ${value.value})`
    case 'red': return `rgb(${value.value}, ${ctx.g ?? 0}, ${ctx.b ?? 0})`
    case 'green': return `rgb(${ctx.r ?? 0}, ${value.value}, ${ctx.b ?? 0})`
    case 'blue': return `rgb(${ctx.r ?? 0}, ${ctx.g ?? 0}, ${value.value})`
    default: return '#000'
  }
})

const thumbStyle = computed(() => {
  const base: Record<string, string> = { backgroundColor: thumbColor.value }
  if (props.orientation === 'horizontal') {
    base.left = `${percentage.value}%`
    base.top = '50%'
    base.transform = 'translate(-50%, -50%)'
  } else {
    base.bottom = `${percentage.value}%`
    base.left = '50%'
    base.transform = 'translate(-50%, 50%)'
  }
  return base
})

const outputLabel = computed(() => {
  if (props.channel === 'alpha') return `${Math.round(value.value * 100)}%`
  if (props.channel === 'hue') return `${Math.round(value.value)}°`
  return Math.round(value.value).toString()
})

const trackRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

function getValueFromEvent(e: MouseEvent | TouchEvent): number {
  const track = trackRef.value
  if (!track) return value.value
  const rect = track.getBoundingClientRect()
  const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
  const cy = 'touches' in e ? e.touches[0].clientY : e.clientY

  let ratio: number
  if (props.orientation === 'horizontal') {
    ratio = (cx - rect.left) / rect.width
  } else {
    ratio = 1 - (cy - rect.top) / rect.height
  }

  ratio = Math.min(1, Math.max(0, ratio))
  const newVal = range.value.min + ratio * (range.value.max - range.value.min)
  const stepped = Math.round(newVal / range.value.step) * range.value.step
  return Math.min(range.value.max, Math.max(range.value.min, parseFloat(stepped.toFixed(2))))
}

function handleTrackClick(e: MouseEvent) {
  if (props.disabled) return
  value.value = getValueFromEvent(e)
}

function handleThumbDown(e: MouseEvent) {
  if (props.disabled) return
  e.preventDefault()
  isDragging.value = true

  function onMove(ev: MouseEvent) { value.value = getValueFromEvent(ev) }
  function onUp() {
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  const step = range.value.step
  const big = step * 10

  switch (e.key) {
    case 'ArrowRight': case 'ArrowUp':
      e.preventDefault(); value.value = Math.min(range.value.max, parseFloat((value.value + step).toFixed(2))); break
    case 'ArrowLeft': case 'ArrowDown':
      e.preventDefault(); value.value = Math.max(range.value.min, parseFloat((value.value - step).toFixed(2))); break
    case 'PageUp':
      e.preventDefault(); value.value = Math.min(range.value.max, parseFloat((value.value + big).toFixed(2))); break
    case 'PageDown':
      e.preventDefault(); value.value = Math.max(range.value.min, parseFloat((value.value - big).toFixed(2))); break
    case 'Home':
      e.preventDefault(); value.value = range.value.min; break
    case 'End':
      e.preventDefault(); value.value = range.value.max; break
  }
}
</script>

<template>
  <div :class="cn('flex w-full flex-col gap-1', disabled && 'opacity-50 pointer-events-none', props.class)">
    <!-- Label + output row -->
    <div v-if="label || showOutput" class="flex items-center justify-between">
      <span v-if="label" :class="colorSliderLabelTheme">{{ label }}</span>
      <output v-if="showOutput" :class="colorSliderOutputTheme">{{ outputLabel }}</output>
    </div>

    <!-- Track -->
    <div
      ref="trackRef"
      class="relative rounded-full cursor-pointer"
      :style="{
        background: trackBackground,
        height: orientation === 'horizontal' ? '20px' : '100%',
        width: orientation === 'horizontal' ? '100%' : '20px',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
      }"
      @click="handleTrackClick"
    >
      <!-- Thumb -->
      <div
        class="absolute rounded-full cursor-grab size-4 z-10 focus-visible:ring-2 focus-visible:ring-ousi-focus outline-none"
        :class="isDragging ? 'cursor-grabbing' : ''"
        :style="{
          ...thumbStyle,
          border: '3px solid white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }"
        role="slider"
        :aria-label="label ?? channel"
        :aria-valuenow="value"
        :aria-valuemin="range.min"
        :aria-valuemax="range.max"
        :aria-orientation="orientation"
        tabindex="0"
        @mousedown="handleThumbDown"
        @keydown="handleKeydown"
      />
    </div>
  </div>
</template>
