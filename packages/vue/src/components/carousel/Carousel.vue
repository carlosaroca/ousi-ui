<script setup lang="ts">
import { ref, computed, toRef, watch, onMounted, onBeforeUnmount, useSlots, type VNode } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import {
  carouselTheme,
  carouselTrackTheme,
  carouselSlideTheme,
  carouselArrowTheme,
  carouselDotsTheme,
  carouselDotTheme,
} from './carousel.theme'
import type { CarouselProps, CarouselEmits } from './carousel.types'

const props = withDefaults(defineProps<CarouselProps>(), {
  defaultValue: 0,
  loop: false,
  autoplay: false,
  autoplayInterval: 5000,
  pauseOnHover: true,
  showDots: true,
  showArrows: true,
  slidesPerView: 1,
  gap: 0,
})

const emit = defineEmits<CarouselEmits>()

const slots = useSlots()

const activeIndex = useControllableState<number>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// Flatten slot children (handles fragments)
function flattenSlots(children: VNode[]): VNode[] {
  const result: VNode[] = []
  for (const child of children) {
    if (child.type === Symbol.for('v-fgt') || (child.type as any) === Symbol.for('v-fgt')) {
      // Fragment — recurse into its children
      if (Array.isArray(child.children)) {
        result.push(...flattenSlots(child.children as VNode[]))
      }
    } else {
      result.push(child)
    }
  }
  return result
}

const slideNodes = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []
  return flattenSlots(defaultSlot)
})

const slideCount = computed(() => slideNodes.value.length)

const maxIndex = computed(() => Math.max(0, slideCount.value - props.slidesPerView))

// Track transform
const trackStyle = computed(() => {
  const offset = activeIndex.value * (100 / props.slidesPerView)
  return {
    transform: `translateX(-${offset}%)`,
  }
})

// Slide wrapper style
function slideStyle() {
  const width = `${100 / props.slidesPerView}%`
  const padding = props.gap > 0 ? `0 ${props.gap / 2}px` : undefined
  return { width, padding }
}

// Navigation
function goTo(index: number) {
  if (props.loop) {
    if (index < 0) index = maxIndex.value
    else if (index > maxIndex.value) index = 0
  } else {
    index = Math.max(0, Math.min(index, maxIndex.value))
  }
  activeIndex.value = index
}

function prev() {
  goTo(activeIndex.value - 1)
}

function next() {
  goTo(activeIndex.value + 1)
}

const canGoPrev = computed(() => props.loop || activeIndex.value > 0)
const canGoNext = computed(() => props.loop || activeIndex.value < maxIndex.value)

// Autoplay
const isHovered = ref(false)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

function startAutoplay() {
  stopAutoplay()
  if (!props.autoplay) return
  autoplayTimer = setInterval(() => {
    if (props.pauseOnHover && isHovered.value) return
    next()
  }, props.autoplayInterval)
}

function stopAutoplay() {
  if (autoplayTimer !== null) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

watch(() => props.autoplay, (val) => {
  if (val) startAutoplay()
  else stopAutoplay()
})

watch(() => props.autoplayInterval, () => {
  if (props.autoplay) startAutoplay()
})

onMounted(() => {
  if (props.autoplay) startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})

// Touch / swipe support
const pointerStartX = ref(0)
const pointerCurrentX = ref(0)
const isSwiping = ref(false)

function onPointerDown(e: PointerEvent) {
  isSwiping.value = true
  pointerStartX.value = e.clientX
  pointerCurrentX.value = e.clientX
}

function onPointerMove(e: PointerEvent) {
  if (!isSwiping.value) return
  pointerCurrentX.value = e.clientX
}

function onPointerUp() {
  if (!isSwiping.value) return
  isSwiping.value = false
  const dx = pointerCurrentX.value - pointerStartX.value
  if (Math.abs(dx) > 50) {
    if (dx < 0) next()
    else prev()
  }
}

// Keyboard navigation
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
}
</script>

<template>
  <div
    :class="cn(carouselTheme, props.class)"
    tabindex="0"
    role="region"
    aria-roledescription="carousel"
    aria-label="Carousel"
    @keydown="onKeydown"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Track -->
    <div
      :class="carouselTrackTheme"
      :style="trackStyle"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div
        v-for="(node, i) in slideNodes"
        :key="i"
        :class="carouselSlideTheme"
        :style="slideStyle()"
        role="group"
        :aria-roledescription="'slide'"
        :aria-label="`Slide ${i + 1} of ${slideCount}`"
      >
        <component :is="node" />
      </div>
    </div>

    <!-- Left arrow -->
    <button
      v-if="showArrows && canGoPrev"
      :class="cn(carouselArrowTheme, 'left-3')"
      aria-label="Previous slide"
      @click="prev"
    >
      <slot name="arrow-left" :prev="prev" :can-go-prev="canGoPrev">
        <svg
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </slot>
    </button>

    <!-- Right arrow -->
    <button
      v-if="showArrows && canGoNext"
      :class="cn(carouselArrowTheme, 'right-3')"
      aria-label="Next slide"
      @click="next"
    >
      <slot name="arrow-right" :next="next" :can-go-next="canGoNext">
        <svg
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </slot>
    </button>

    <!-- Dots -->
    <div v-if="showDots && slideCount > 1" :class="carouselDotsTheme">
      <button
        v-for="i in slideCount"
        :key="i - 1"
        :class="cn(
          carouselDotTheme,
          !$slots.dot && (activeIndex === i - 1 ? 'bg-ousi-accent scale-125' : 'bg-ousi-border'),
        )"
        :aria-label="`Go to slide ${i}`"
        :aria-current="activeIndex === i - 1 ? 'true' : undefined"
        @click="goTo(i - 1)"
      >
        <slot name="dot" :index="i - 1" :active="activeIndex === i - 1" />
      </button>
    </div>
  </div>
</template>
