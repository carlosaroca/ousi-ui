<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import {
  sliderTheme,
  sliderTrackWrapperTheme,
  sliderTrackBarTheme,
  sliderFillTheme,
  sliderThumbTheme,
  sliderLabelTheme,
  sliderOutputTheme,
} from './slider.theme'
import type { SliderProps, SliderEmits, SliderValue } from './slider.types'

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  size: 'md',
  color: 'primary',
  showOutput: false,
  disabled: false,
})

const emit = defineEmits<SliderEmits>()

const isRange = computed(() => Array.isArray(props.modelValue ?? props.defaultValue))
const isH = computed(() => props.orientation === 'horizontal')

const value = useControllableState<SliderValue>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? (isRange.value ? [25, 75] : 50),
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const thumbs = computed((): number[] => {
  const v = value.value
  return Array.isArray(v) ? [v[0], v[1]] : [v as number]
})

function toPercent(val: number): number {
  return ((val - props.min) / (props.max - props.min)) * 100
}

const thumb0Pct = computed(() => toPercent(thumbs.value[0]))
const thumb1Pct = computed(() => isRange.value ? toPercent(thumbs.value[1]) : null)

// Thumb pill long-axis size in px per size variant
const thumbLongPx = computed(() => {
  const map = { sm: 18, md: 24, lg: 30 }
  return map[props.size]
})

const thumbHalf = computed(() => `${thumbLongPx.value / 2}px`)

// Fill extends to just past the thumb center — tiny 1px gap so the rounded end peeks out
const fillStyle = computed(() => {
  const offset = thumbLongPx.value / 2 + 3
  if (isRange.value && thumb1Pct.value !== null) {
    const lo = Math.min(thumb0Pct.value, thumb1Pct.value)
    const hi = Math.max(thumb0Pct.value, thumb1Pct.value)
    return isH.value
      ? { left: `calc(${lo}% - ${offset}px)`, width: `calc(${hi - lo}% + ${offset * 2}px)` }
      : { bottom: `calc(${lo}% - ${offset}px)`, height: `calc(${hi - lo}% + ${offset * 2}px)` }
  }
  return isH.value
    ? { left: '0%', width: `calc(${thumb0Pct.value}% + ${offset}px)` }
    : { bottom: '0%', height: `calc(${thumb0Pct.value}% + ${offset}px)` }
})

// Thumb pill dimensions per size + orientation
const thumbSizeStyle = computed(() => {
  const sizes = {
    sm: isH.value ? { width: '18px', height: '10px' } : { width: '10px', height: '18px' },
    md: isH.value ? { width: '24px', height: '14px' } : { width: '14px', height: '24px' },
    lg: isH.value ? { width: '30px', height: '18px' } : { width: '18px', height: '30px' },
  }
  return sizes[props.size]
})

function thumbPositionStyle(pct: number) {
  return isH.value
    ? { left: `${pct}%` }
    : { bottom: `${pct}%` }
}

const trackRef = ref<HTMLElement | null>(null)
const draggingThumb = ref<number | null>(null)

function getValueFromPosition(clientX: number, clientY: number): number {
  const el = trackRef.value
  if (!el) return props.min
  const rect = el.getBoundingClientRect()

  const ratio = isH.value
    ? (clientX - rect.left) / rect.width
    : 1 - (clientY - rect.top) / rect.height

  const clamped = Math.min(1, Math.max(0, ratio))
  const raw = props.min + clamped * (props.max - props.min)
  return Math.round(raw / props.step) * props.step
}

function applyValue(thumbIdx: number, newVal: number) {
  const clamped = Math.min(props.max, Math.max(props.min, newVal))
  if (!isRange.value) {
    value.value = clamped
    return
  }
  const [v0, v1] = thumbs.value
  if (thumbIdx === 0) {
    value.value = [Math.min(clamped, v1), v1]
  } else {
    value.value = [v0, Math.max(clamped, v0)]
  }
}

function handleTrackClick(e: MouseEvent) {
  if (props.disabled) return
  const newVal = getValueFromPosition(e.clientX, e.clientY)
  if (!isRange.value) { applyValue(0, newVal); return }
  const d0 = Math.abs(newVal - thumbs.value[0])
  const d1 = Math.abs(newVal - thumbs.value[1])
  applyValue(d0 <= d1 ? 0 : 1, newVal)
}

function startDrag(e: MouseEvent | TouchEvent, thumbIdx: number) {
  if (props.disabled) return
  e.preventDefault()
  e.stopPropagation()
  draggingThumb.value = thumbIdx

  function onMove(ev: MouseEvent | TouchEvent) {
    const cx = 'touches' in ev ? ev.touches[0].clientX : ev.clientX
    const cy = 'touches' in ev ? ev.touches[0].clientY : ev.clientY
    applyValue(thumbIdx, getValueFromPosition(cx, cy))
  }

  function onEnd() {
    draggingThumb.value = null
    document.removeEventListener('mousemove', onMove as any)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove as any)
    document.removeEventListener('touchend', onEnd)
  }

  document.addEventListener('mousemove', onMove as any)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onMove as any, { passive: false })
  document.addEventListener('touchend', onEnd)
}

function handleKeydown(e: KeyboardEvent, thumbIdx: number) {
  if (props.disabled) return
  const current = thumbs.value[thumbIdx]
  const big = props.step * 10
  switch (e.key) {
    case 'ArrowRight': case 'ArrowUp':
      e.preventDefault(); applyValue(thumbIdx, current + props.step); break
    case 'ArrowLeft': case 'ArrowDown':
      e.preventDefault(); applyValue(thumbIdx, current - props.step); break
    case 'PageUp':
      e.preventDefault(); applyValue(thumbIdx, current + big); break
    case 'PageDown':
      e.preventDefault(); applyValue(thumbIdx, current - big); break
    case 'Home':
      e.preventDefault(); applyValue(thumbIdx, props.min); break
    case 'End':
      e.preventDefault(); applyValue(thumbIdx, props.max); break
  }
}

function formatValue(val: number): string {
  if (props.formatOptions) {
    return new Intl.NumberFormat(undefined, props.formatOptions).format(val)
  }
  return String(val)
}

const outputLabel = computed(() => {
  if (isRange.value) {
    return `${formatValue(thumbs.value[0])} – ${formatValue(thumbs.value[1])}`
  }
  return formatValue(thumbs.value[0])
})
</script>

<template>
  <div
    :class="cn(sliderTheme({ orientation, disabled }), props.class)"
    :data-orientation="orientation"
    :data-disabled="disabled || undefined"
  >
    <label v-if="label" :class="sliderLabelTheme">{{ label }}</label>

    <output v-if="showOutput" :class="sliderOutputTheme({ orientation })">
      {{ outputLabel }}
    </output>

    <!-- Outer wrapper — NO overflow:hidden, thumbs render here -->
    <div
      ref="trackRef"
      :class="sliderTrackWrapperTheme({ orientation, size })"
      @click="handleTrackClick"
    >
      <!-- Inner track bar — HAS overflow:hidden, clips the fill -->
      <div :class="sliderTrackBarTheme">
        <div :class="sliderFillTheme({ orientation, color })" :style="fillStyle" :data-dragging="draggingThumb !== null || undefined" />
      </div>

      <!-- Thumb 0 — on the outer wrapper, NOT clipped -->
      <div
        :class="sliderThumbTheme({ orientation })"
        :style="{ ...thumbSizeStyle, ...thumbPositionStyle(thumb0Pct) }"
        :data-dragging="draggingThumb === 0 || undefined"
        :data-disabled="disabled || undefined"
        role="slider"
        :aria-label="isRange ? 'Minimum' : (label ?? 'Value')"
        :aria-valuenow="thumbs[0]"
        :aria-valuemin="min"
        :aria-valuemax="isRange ? thumbs[1] : max"
        :aria-orientation="orientation"
        tabindex="0"
        @mousedown="startDrag($event, 0)"
        @touchstart.prevent="startDrag($event, 0)"
        @keydown="handleKeydown($event, 0)"
      />

      <!-- Thumb 1 (range) — also NOT clipped -->
      <div
        v-if="isRange && thumb1Pct !== null"
        :class="sliderThumbTheme({ orientation })"
        :style="{ ...thumbSizeStyle, ...thumbPositionStyle(thumb1Pct) }"
        :data-dragging="draggingThumb === 1 || undefined"
        :data-disabled="disabled || undefined"
        role="slider"
        aria-label="Maximum"
        :aria-valuenow="thumbs[1]"
        :aria-valuemin="thumbs[0]"
        :aria-valuemax="max"
        :aria-orientation="orientation"
        tabindex="0"
        @mousedown="startDrag($event, 1)"
        @touchstart.prevent="startDrag($event, 1)"
        @keydown="handleKeydown($event, 1)"
      />
    </div>
  </div>
</template>
