<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import { cn } from '@ousi-ui/core'
import { OButton } from '../button'
import type { MagneticButtonProps, MagneticButtonEmits } from './magnetic-button.types'

const props = withDefaults(defineProps<MagneticButtonProps>(), {
  variant: 'secondary',
  size: 'md',
  popupWidth: 240,
  magnetStrength: 0.3,
  tiltMax: 15,
  disabled: false,
})

const emit = defineEmits<MagneticButtonEmits>()
const slots = useSlots()

const containerRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)

// Mouse position relative to button center (-1 to 1)
const mouseRel = ref({ x: 0, y: 0 })

// Button magnetic offset
const buttonOffset = computed(() => {
  if (!isHovered.value) return { x: 0, y: 0 }
  return {
    x: mouseRel.value.x * 8 * props.magnetStrength,
    y: mouseRel.value.y * 6 * props.magnetStrength,
  }
})

// Popup 3D tilt
const popupTransform = computed(() => {
  if (!isHovered.value) return 'scale(0.8) rotateX(0deg) rotateY(0deg) translateY(8px)'
  const rx = -mouseRel.value.y * props.tiltMax
  const ry = mouseRel.value.x * props.tiltMax
  return `scale(1) rotateX(${rx}deg) rotateY(${ry}deg) translateY(0px)`
})

function handleMouseMove(e: MouseEvent) {
  if (props.disabled) return
  const el = containerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  mouseRel.value = {
    x: Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2))),
    y: Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2))),
  }
}

function handleMouseEnter(e: MouseEvent) {
  if (props.disabled) return
  isHovered.value = true
  handleMouseMove(e)
}

function handleMouseLeave() {
  isHovered.value = false
  mouseRel.value = { x: 0, y: 0 }
}

function handleClick(e: MouseEvent) {
  if (props.disabled) return
  emit('click', e)
}
</script>

<template>
  <div
    ref="containerRef"
    class="relative inline-block"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Popup card — floats above the button -->
    <div
      v-if="popupSrc || slots.popup"
      class="absolute bottom-full left-1/2 mb-3 pointer-events-none"
      :style="{
        width: `${popupWidth}px`,
        marginLeft: `-${popupWidth / 2}px`,
        opacity: isHovered ? 1 : 0,
        transform: popupTransform,
        transformStyle: 'preserve-3d',
        perspective: '800px',
        transition: 'opacity 250ms cubic-bezier(0.32, 0.72, 0, 1), transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 50,
      }"
    >
      <div
        class="rounded-ousi-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white"
        :style="{ transform: 'translateZ(30px)' }"
      >
        <slot name="popup">
          <img
            :src="popupSrc"
            :alt="popupAlt ?? label"
            class="w-full h-auto block"
            draggable="false"
          />
        </slot>
      </div>
    </div>

    <!-- Button with magnetic offset — uses OButton -->
    <OButton
      :variant="variant"
      :size="size"
      :disabled="disabled"
      :class="cn(props.class)"
      :style="{
        transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
        transition: isHovered
          ? 'transform 150ms cubic-bezier(0.32, 0.72, 0, 1)'
          : 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }"
      @click="handleClick"
    >
      <template v-if="$slots.start" #start>
        <slot name="start" />
      </template>
      <slot>{{ label }}</slot>
      <template v-if="$slots.end" #end>
        <slot name="end" />
      </template>
    </OButton>
  </div>
</template>
