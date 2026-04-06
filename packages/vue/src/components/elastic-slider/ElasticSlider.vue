<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import type { ElasticSliderProps, ElasticSliderEmits } from './elastic-slider.types'
import {
  elasticSliderBarTheme,
} from './elastic-slider.theme'

const props = withDefaults(defineProps<ElasticSliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  barCount: 36,
  size: 'md',
  color: 'primary',
  showTooltip: true,
  showPercent: false,
  waveRadius: 8,
  waveIntensity: 0.85,
  disabled: false,
})

const emit = defineEmits<ElasticSliderEmits>()

const value = useControllableState<number>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? Math.round((props.min + props.max) / 2),
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const trackRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)
const isDragging = ref(false)
const hoverIndex = ref(-1)

// Size config
const sizeConfig = computed(() => {
  switch (props.size) {
    case 'sm': return { collapsed: 32, expanded: 56, barGap: 2, padding: 10, barRadius: 1.5, tooltipText: 'text-xs' }
    case 'md': return { collapsed: 40, expanded: 72, barGap: 2.5, padding: 14, barRadius: 2, tooltipText: 'text-sm' }
    case 'lg': return { collapsed: 52, expanded: 96, barGap: 3, padding: 18, barRadius: 2.5, tooltipText: 'text-base' }
    default: return { collapsed: 40, expanded: 72, barGap: 2.5, padding: 14, barRadius: 2, tooltipText: 'text-sm' }
  }
})

const isActive = computed(() => isHovered.value || isDragging.value)

// The percentage of the current value
const valuePercent = computed(() =>
  ((value.value - props.min) / (props.max - props.min)) * 100,
)

// Which bar index the current value lands on
const activeBarIndex = computed(() =>
  Math.round((valuePercent.value / 100) * (props.barCount - 1)),
)

// Compute bar height as a fraction (0–1) of the available inner height
function getBarHeight(index: number): number {
  // In collapsed state, all bars are the same height
  if (!isActive.value) return 1

  // In expanded state, bars dip DOWN near the cursor (valley effect)
  const target = isDragging.value ? activeBarIndex.value : hoverIndex.value
  if (target < 0) return 1

  const distance = Math.abs(index - target)
  if (distance >= props.waveRadius) return 1

  // Smooth cosine valley: 1 at edges → (1 - intensity) at center
  const t = 1 - distance / props.waveRadius
  const wave = (Math.cos(Math.PI * (1 - t)) + 1) / 2
  return 1 - props.waveIntensity * wave
}

// Get value from a clientX position
function getValueFromX(clientX: number): number {
  const el = trackRef.value
  if (!el) return value.value
  const rect = el.getBoundingClientRect()
  const pad = sizeConfig.value.padding
  const innerWidth = rect.width - pad * 2
  const px = Math.max(0, Math.min(innerWidth, clientX - rect.left - pad))
  const pct = px / innerWidth
  const raw = props.min + pct * (props.max - props.min)
  const stepped = Math.round(raw / props.step) * props.step
  return Math.max(props.min, Math.min(props.max, stepped))
}

// Get bar index from clientX
function getBarIndexFromX(clientX: number): number {
  const el = trackRef.value
  if (!el) return -1
  const rect = el.getBoundingClientRect()
  const pad = sizeConfig.value.padding
  const innerWidth = rect.width - pad * 2
  const px = Math.max(0, Math.min(innerWidth, clientX - rect.left - pad))
  const pct = px / innerWidth
  return Math.round(pct * (props.barCount - 1))
}

function handleMouseEnter(e: MouseEvent) {
  if (props.disabled) return
  isHovered.value = true
  hoverIndex.value = getBarIndexFromX(e.clientX)
}

function handleMouseLeave() {
  if (!isDragging.value) {
    isHovered.value = false
    hoverIndex.value = -1
  }
}

function handlePointerDown(e: PointerEvent) {
  if (props.disabled) return
  e.preventDefault()
  isDragging.value = true
  value.value = getValueFromX(e.clientX)
  hoverIndex.value = getBarIndexFromX(e.clientX)
  const el = trackRef.value
  if (el) el.setPointerCapture(e.pointerId)
}

function handlePointerMove(e: PointerEvent) {
  if (props.disabled) return
  hoverIndex.value = getBarIndexFromX(e.clientX)
  if (isDragging.value) {
    value.value = getValueFromX(e.clientX)
  }
}

function handlePointerUp(e: PointerEvent) {
  isDragging.value = false
  const el = trackRef.value
  if (el) el.releasePointerCapture(e.pointerId)
  if (el) {
    const rect = el.getBoundingClientRect()
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      isHovered.value = false
      hoverIndex.value = -1
    }
  }
}

// Keyboard support
function handleKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  let newVal = value.value
  const big = props.step * 10
  switch (e.key) {
    case 'ArrowRight': case 'ArrowUp': newVal = Math.min(props.max, value.value + props.step); break
    case 'ArrowLeft': case 'ArrowDown': newVal = Math.max(props.min, value.value - props.step); break
    case 'PageUp': newVal = Math.min(props.max, value.value + big); break
    case 'PageDown': newVal = Math.max(props.min, value.value - big); break
    case 'Home': newVal = props.min; break
    case 'End': newVal = props.max; break
    default: return
  }
  e.preventDefault()
  value.value = newVal
}

// Tooltip position — follows the value position when dragging, hover position otherwise
const tooltipPosition = computed(() => {
  if (isDragging.value) return valuePercent.value
  if (hoverIndex.value >= 0) {
    return (hoverIndex.value / (props.barCount - 1)) * 100
  }
  return valuePercent.value
})

const tooltipValue = computed(() => {
  if (isDragging.value) return value.value
  if (isHovered.value && hoverIndex.value >= 0) {
    const pct = hoverIndex.value / (props.barCount - 1)
    const raw = props.min + pct * (props.max - props.min)
    return Math.round(raw / props.step) * props.step
  }
  return value.value
})

const showTooltipNow = computed(() =>
  props.showTooltip && isActive.value,
)

const BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const SMOOTH = 'cubic-bezier(0.22, 1, 0.36, 1)'
</script>

<template>
  <div
    :class="cn('relative select-none', props.class)"
    role="slider"
    :tabindex="disabled ? -1 : 0"
    :aria-valuenow="value"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-disabled="disabled || undefined"
    @keydown="handleKeydown"
  >
    <!-- Tooltip with arrow -->
    <Transition name="elastic-tooltip">
      <div
        v-if="showTooltipNow"
        class="absolute z-10 pointer-events-none flex flex-col items-center"
        :style="{
          left: `calc(${sizeConfig.padding}px + ${tooltipPosition}% * (100% - ${sizeConfig.padding * 2}px) / 100%)`,
          bottom: `${isActive ? sizeConfig.expanded : sizeConfig.collapsed}px`,
          transform: 'translateX(-50%)',
          marginBottom: '4px',
          transition: isDragging
            ? 'left 60ms ease-out, bottom 400ms cubic-bezier(0.34, 1.56, 0.64, 1)'
            : `left 400ms ${SMOOTH}, bottom 400ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
        }"
      >
        <div
          :class="[
            'px-2.5 py-1 rounded-ousi-lg bg-ousi-surface border border-ousi-border shadow-lg font-semibold text-ousi-foreground whitespace-nowrap',
            sizeConfig.tooltipText,
          ]"
        >
          <slot name="tooltip" :value="tooltipValue">
            {{ tooltipValue }}{{ showPercent ? '%' : '' }}
          </slot>
        </div>
        <!-- Arrow -->
        <svg
          width="12" height="8" viewBox="0 0 12 8"
          class="text-ousi-border -mt-px"
        >
          <path d="M0 0 L6 8 L12 0" fill="var(--ousi-surface, #fff)" stroke="currentColor" stroke-width="1" />
        </svg>
      </div>
    </Transition>

    <!-- Track container — expands on hover -->
    <div
      ref="trackRef"
      :class="[
        'w-full rounded-ousi-2xl border border-ousi-border/50 bg-ousi-surface overflow-hidden flex cursor-pointer transition-all',
        isActive ? 'items-end' : 'items-center',
        disabled ? 'opacity-50 pointer-events-none cursor-default' : '',
      ]"
      :style="{
        height: `${isActive ? sizeConfig.expanded : sizeConfig.collapsed}px`,
        padding: `0 ${sizeConfig.padding}px`,
        gap: `${sizeConfig.barGap}px`,
        transition: `height 400ms ${BOUNCE}`,
      }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
    >
      <div
        v-for="i in barCount"
        :key="i"
        :class="elasticSliderBarTheme({ color, active: (i - 1) <= activeBarIndex })"
        :style="{
          flex: '1 1 0',
          minWidth: '2px',
          height: `${getBarHeight(i - 1) * (isActive ? 75 : 40)}%`,
          borderRadius: `${sizeConfig.barRadius}px`,
          transition: isDragging
            ? `height 80ms ease-out, opacity 100ms ease, background-color 80ms ease`
            : `height 350ms ${BOUNCE}, opacity 400ms ${SMOOTH}, background-color 400ms ${SMOOTH}`,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.elastic-tooltip-enter-active {
  transition: opacity 200ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.elastic-tooltip-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.elastic-tooltip-enter-from,
.elastic-tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px) scale(0.9);
}
</style>
