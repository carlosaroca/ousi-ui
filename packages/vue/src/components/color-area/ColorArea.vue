<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { colorAreaBaseTheme } from './color-area.theme'
import type { ColorAreaProps, ColorAreaEmits, ColorAreaValue } from './color-area.types'

const props = withDefaults(defineProps<ColorAreaProps>(), {
  hue: 0,
  showDots: false,
  disabled: false,
})

const emit = defineEmits<ColorAreaEmits>()

const value = useControllableState<ColorAreaValue>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? { x: 100, y: 100 },
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const areaRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const areaStyle = computed(() => ({
  backgroundColor: `hsl(${props.hue}, 100%, 50%)`,
  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0)), linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
}))

const thumbColor = computed(() => {
  const s = value.value.x
  const v = value.value.y
  const l = v * (1 - s / 200)
  const sl = l === 0 || l === 100 ? 0 : ((v - l) / Math.min(l, 100 - l)) * 100
  return `hsl(${props.hue}, ${sl.toFixed(1)}%, ${l.toFixed(1)}%)`
})

const thumbStyle = computed(() => {
  const size = isDragging.value ? 20 : 16
  return {
    left: `${value.value.x}%`,
    top: `${100 - value.value.y}%`,
    transform: 'translate(-50%, -50%)',
    backgroundColor: thumbColor.value,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '9999px',
    border: '3px solid white',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.1)',
    transition: 'width 150ms ease-out, height 150ms ease-out',
    cursor: isDragging.value ? 'grabbing' : 'grab',
  }
})

function getVal(e: MouseEvent | TouchEvent): ColorAreaValue {
  const area = areaRef.value
  if (!area) return value.value
  const rect = area.getBoundingClientRect()
  const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
  const cy = 'touches' in e ? e.touches[0].clientY : e.clientY
  const x = Math.min(100, Math.max(0, ((cx - rect.left) / rect.width) * 100))
  const y = Math.min(100, Math.max(0, (1 - (cy - rect.top) / rect.height) * 100))
  return { x: Math.round(x), y: Math.round(y) }
}

function handleClick(e: MouseEvent) {
  if (props.disabled) return
  value.value = getVal(e)
}

function handleDown(e: MouseEvent) {
  if (props.disabled) return
  e.preventDefault()
  isDragging.value = true
  function onMove(ev: MouseEvent) { value.value = getVal(ev) }
  function onUp() {
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function handleTouch(e: TouchEvent) {
  if (props.disabled) return
  e.preventDefault()
  isDragging.value = true
  function onMove(ev: TouchEvent) { value.value = getVal(ev) }
  function onEnd() {
    isDragging.value = false
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)
  }
  document.addEventListener('touchmove', onMove, { passive: false })
  document.addEventListener('touchend', onEnd)
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  let { x, y } = value.value
  switch (e.key) {
    case 'ArrowRight': e.preventDefault(); x = Math.min(100, x + 1); break
    case 'ArrowLeft': e.preventDefault(); x = Math.max(0, x - 1); break
    case 'ArrowUp': e.preventDefault(); y = Math.min(100, y + 1); break
    case 'ArrowDown': e.preventDefault(); y = Math.max(0, y - 1); break
    case 'PageUp': e.preventDefault(); y = Math.min(100, y + 10); break
    case 'PageDown': e.preventDefault(); y = Math.max(0, y - 10); break
    default: return
  }
  value.value = { x, y }
}
</script>

<template>
  <div
    ref="areaRef"
    :class="cn(colorAreaBaseTheme, disabled && 'opacity-50 pointer-events-none', props.class)"
    :style="areaStyle"
    @click="handleClick"
  >
    <!-- Dots overlay -->
    <div
      v-if="showDots"
      class="pointer-events-none absolute inset-0 rounded-[inherit]"
      :style="{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '8px 8px' }"
    />

    <!-- Thumb -->
    <div
      class="absolute outline-none focus-visible:ring-2 focus-visible:ring-ousi-focus z-10"
      :style="thumbStyle"
      role="slider"
      aria-label="Color"
      :aria-valuenow="Math.round(value.x)"
      tabindex="0"
      @mousedown="handleDown"
      @touchstart.prevent="handleTouch"
      @keydown="handleKeydown"
    />
  </div>
</template>
