<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import {
  imageCompareTheme,
  imageCompareImageTheme,
  imageCompareDividerTheme,
  imageCompareHandleTheme,
  imageCompareLabelTheme,
} from './image-compare.theme'
import type { ImageCompareProps, ImageCompareEmits } from './image-compare.types'

const props = withDefaults(defineProps<ImageCompareProps>(), {
  defaultValue: 50,
  orientation: 'horizontal',
  showDivider: true,
  showHandle: true,
  rounded: true,
  disabled: false,
})

const emit = defineEmits<ImageCompareEmits>()

const position = useControllableState<number>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const containerRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const isH = computed(() => props.orientation === 'horizontal')

// Clip path for the "before" image — reveals only up to the divider position
const beforeClip = computed(() => {
  const p = position.value
  return isH.value
    ? `inset(0 ${100 - p}% 0 0)`
    : `inset(0 0 ${100 - p}% 0)`
})

// Divider position style
const dividerStyle = computed(() => {
  if (isH.value) {
    return {
      left: `${position.value}%`,
      top: '0',
      bottom: '0',
      width: '2px',
      transform: 'translateX(-1px)',
    }
  }
  return {
    top: `${position.value}%`,
    left: '0',
    right: '0',
    height: '2px',
    transform: 'translateY(-1px)',
  }
})

// Handle position style
const handleStyle = computed(() => {
  if (isH.value) {
    return {
      left: `${position.value}%`,
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }
  return {
    top: `${position.value}%`,
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
})

// Handle size
const handleSize = { width: '40px', height: '40px' }

function getPositionFromEvent(clientX: number, clientY: number): number {
  const el = containerRef.value
  if (!el) return position.value
  const rect = el.getBoundingClientRect()

  let ratio: number
  if (isH.value) {
    ratio = (clientX - rect.left) / rect.width
  } else {
    ratio = (clientY - rect.top) / rect.height
  }

  return Math.min(100, Math.max(0, ratio * 100))
}

function handlePointerDown(e: PointerEvent) {
  if (props.disabled) return
  e.preventDefault()
  isDragging.value = true

  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)

  position.value = getPositionFromEvent(e.clientX, e.clientY)
}

function handlePointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  position.value = getPositionFromEvent(e.clientX, e.clientY)
}

function handlePointerUp() {
  isDragging.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  const step = e.shiftKey ? 10 : 1

  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    position.value = Math.max(0, position.value - step)
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    position.value = Math.min(100, position.value + step)
  } else if (e.key === 'Home') {
    e.preventDefault()
    position.value = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    position.value = 100
  }
}
</script>

<template>
  <div
    ref="containerRef"
    :class="cn(
      imageCompareTheme,
      rounded ? 'rounded-ousi-2xl' : '',
      disabled ? 'opacity-50 pointer-events-none' : 'cursor-col-resize',
      props.class,
    )"
    role="slider"
    :aria-valuenow="Math.round(position)"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-orientation="orientation"
    :aria-label="beforeLabel && afterLabel ? `Compare ${beforeLabel} and ${afterLabel}` : 'Image comparison'"
    tabindex="0"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
    @keydown="handleKeydown"
  >
    <!-- After image (bottom layer, fully visible) -->
    <img
      :src="afterSrc"
      :alt="afterAlt ?? 'After'"
      :class="imageCompareImageTheme"
      draggable="false"
    />

    <!-- Before image (top layer, clipped to divider position) -->
    <img
      :src="beforeSrc"
      :alt="beforeAlt ?? 'Before'"
      :class="imageCompareImageTheme"
      :style="{ clipPath: beforeClip }"
      draggable="false"
    />

    <!-- Before label -->
    <span
      v-if="beforeLabel"
      :class="imageCompareLabelTheme"
      :style="isH
        ? { left: '12px', bottom: '12px', opacity: position > 10 ? 1 : 0 }
        : { left: '12px', top: '12px', opacity: position > 10 ? 1 : 0 }
      "
    >
      {{ beforeLabel }}
    </span>

    <!-- After label -->
    <span
      v-if="afterLabel"
      :class="imageCompareLabelTheme"
      :style="isH
        ? { right: '12px', bottom: '12px', opacity: position < 90 ? 1 : 0 }
        : { right: '12px', bottom: '12px', opacity: position < 90 ? 1 : 0 }
      "
    >
      {{ afterLabel }}
    </span>

    <!-- Divider line -->
    <div
      v-if="showDivider"
      :class="imageCompareDividerTheme"
      :style="dividerStyle"
    />

    <!-- Drag handle -->
    <div
      v-if="showHandle"
      :class="imageCompareHandleTheme"
      :style="{ ...handleStyle, ...handleSize }"
      :data-dragging="isDragging || undefined"
    >
      <!-- Arrows icon — centered in viewBox -->
      <svg
        v-if="isH"
        class="size-5 text-gray-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M8 8l-4 4 4 4" />
        <path d="M16 8l4 4-4 4" />
      </svg>
      <svg
        v-else
        class="size-5 text-gray-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M8 9l4-4 4 4" />
        <path d="M8 15l4 4 4-4" />
      </svg>
    </div>

    <!-- Aspect ratio spacer — makes the container match the image aspect ratio -->
    <img
      :src="afterSrc"
      :alt="''"
      class="invisible w-full h-auto block"
      draggable="false"
    />
  </div>
</template>
