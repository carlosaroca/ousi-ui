<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { ratingTheme, ratingStarTheme } from './rating.theme'
import type { RatingProps, RatingEmits } from './rating.types'

const props = withDefaults(defineProps<RatingProps>(), {
  max: 5,
  size: 'md',
  color: 'primary',
  readOnly: false,
  disabled: false,
  halfStars: false,
  shadow: 'none',
})

const emit = defineEmits<RatingEmits>()

const value = useControllableState<number>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? 0,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const hoveredValue = ref<number | null>(null)

const displayValue = computed(() => hoveredValue.value ?? value.value)

const colorMap: Record<string, string> = {
  primary: 'text-ousi-accent',
  secondary: 'text-ousi-foreground',
  success: 'text-ousi-success',
  danger: 'text-ousi-danger',
  warning: 'text-ousi-warning',
}

const sizeMap: Record<string, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-7',
}

const activeColor = computed(() => colorMap[props.color] ?? colorMap.primary)
const sizeClass = computed(() => sizeMap[props.size] ?? sizeMap.md)

const interactive = computed(() => !props.readOnly && !props.disabled)

function getStarFill(starIndex: number): 'full' | 'half' | 'empty' {
  const current = displayValue.value
  if (current >= starIndex) return 'full'
  if (props.halfStars && current >= starIndex - 0.5) return 'half'
  return 'empty'
}

function handleClick(starIndex: number, event: MouseEvent) {
  if (!interactive.value) return
  if (props.halfStars) {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const isLeftHalf = event.clientX - rect.left < rect.width / 2
    value.value = isLeftHalf ? starIndex - 0.5 : starIndex
  } else {
    value.value = starIndex
  }
}

function handleMouseMove(starIndex: number, event: MouseEvent) {
  if (!interactive.value) return
  if (props.halfStars) {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const isLeftHalf = event.clientX - rect.left < rect.width / 2
    hoveredValue.value = isLeftHalf ? starIndex - 0.5 : starIndex
  } else {
    hoveredValue.value = starIndex
  }
}

function handleMouseLeave() {
  if (!interactive.value) return
  hoveredValue.value = null
}

function handleKeydown(event: KeyboardEvent) {
  if (!interactive.value) return
  const step = props.halfStars ? 0.5 : 1
  let newValue = value.value

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      event.preventDefault()
      newValue = Math.min(value.value + step, props.max)
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      event.preventDefault()
      newValue = Math.max(value.value - step, 0)
      break
    case 'Home':
      event.preventDefault()
      newValue = 0
      break
    case 'End':
      event.preventDefault()
      newValue = props.max
      break
    default:
      return
  }

  value.value = newValue
}

const starPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
</script>

<template>
  <div
    :class="cn(
      ratingTheme({ shadow }),
      props.disabled && 'opacity-50 pointer-events-none',
      props.class,
    )"
    role="slider"
    :tabindex="interactive ? 0 : -1"
    :aria-valuenow="value"
    :aria-valuemin="0"
    :aria-valuemax="props.max"
    :aria-disabled="props.disabled || undefined"
    :aria-readonly="props.readOnly || undefined"
    aria-label="Rating"
    @keydown="handleKeydown"
    @mouseleave="handleMouseLeave"
  >
    <span
      v-for="star in props.max"
      :key="star"
      :class="cn(
        'inline-flex relative',
        sizeClass,
        interactive && ratingStarTheme,
        !interactive && 'cursor-default',
        getStarFill(star) !== 'empty' ? activeColor : 'text-ousi-border',
      )"
      @click="handleClick(star, $event)"
      @mousemove="handleMouseMove(star, $event)"
    >
      <!-- Custom icon slot -->
      <slot
        name="icon"
        :index="star"
        :fill="getStarFill(star)"
        :active="getStarFill(star) !== 'empty'"
      >
        <!-- Default star SVG -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-full"
        >
          <defs v-if="halfStars && getStarFill(star) === 'half'">
            <linearGradient :id="`half-star-${star}`">
              <stop offset="50%" stop-color="currentColor" />
              <stop offset="50%" stop-color="transparent" />
            </linearGradient>
          </defs>
          <path
            :d="starPath"
            :fill="
              getStarFill(star) === 'full'
                ? 'currentColor'
                : getStarFill(star) === 'half'
                  ? `url(#half-star-${star})`
                  : 'none'
            "
            :stroke="getStarFill(star) === 'empty' ? 'currentColor' : undefined"
          />
        </svg>
      </slot>
    </span>
  </div>
</template>
