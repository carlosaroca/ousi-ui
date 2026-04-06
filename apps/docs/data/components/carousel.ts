import type { ComponentData } from './types'

export const carouselData: ComponentData = {
  title: 'Carousel',
  description: 'A slideshow component for cycling through content like images or cards.',
  category: 'Media',
  importCode: "import { OCarousel } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'CarouselBasic',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const currentSlide = ref(0)
</script>

<template>
  <OCarousel v-model="currentSlide">
    <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-accent/20">
      Slide 1
    </div>
    <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-success/20">
      Slide 2
    </div>
    <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-warning/20">
      Slide 3
    </div>
  </OCarousel>
</template>`,
      },
    },
    {
      id: 'autoplay',
      title: 'Autoplay',
      example: {
        component: 'CarouselAutoplay',
        code: `<OCarousel v-model="currentSlide" autoplay loop>
  <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-accent/20">
    Slide 1
  </div>
  <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-success/20">
    Slide 2
  </div>
  <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-warning/20">
    Slide 3
  </div>
</OCarousel>`,
      },
    },
    {
      id: 'multiple-slides',
      title: 'Multiple Slides',
      example: {
        component: 'CarouselBasic',
        code: `<OCarousel v-model="currentSlide" :slides-per-view="2" :gap="16">
  <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-accent/20">
    Slide 1
  </div>
  <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-success/20">
    Slide 2
  </div>
  <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-warning/20">
    Slide 3
  </div>
</OCarousel>`,
      },
    },
    {
      id: 'autoplay-only',
      title: 'Autoplay Only (No Controls)',
      example: {
        component: 'CarouselAutoOnly',
        code: `<OCarousel autoplay :autoplay-interval="3000" :show-arrows="false" :show-dots="false" loop>
  <div class="h-48 rounded-ousi-xl bg-ousi-accent/15 flex items-center justify-center">
    <span class="text-lg font-semibold text-ousi-accent">Slide 1</span>
  </div>
  <div class="h-48 rounded-ousi-xl bg-ousi-success/15 flex items-center justify-center">
    <span class="text-lg font-semibold text-ousi-success">Slide 2</span>
  </div>
  <div class="h-48 rounded-ousi-xl bg-ousi-warning/15 flex items-center justify-center">
    <span class="text-lg font-semibold text-ousi-warning">Slide 3</span>
  </div>
</OCarousel>`,
      },
    },
    {
      id: 'custom-arrows-dots',
      title: 'Custom Arrows & Dots',
      example: {
        component: 'CarouselCustom',
        code: `<OCarousel v-model="currentSlide">
  <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-accent/20">
    Slide 1
  </div>
  <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-success/20">
    Slide 2
  </div>
  <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-warning/20">
    Slide 3
  </div>

  <template #dot="{ index, active }">
    <span
      :class="[
        'inline-block rounded-full transition-all duration-300',
        active ? 'w-6 h-2 bg-ousi-accent' : 'w-2 h-2 bg-ousi-border',
      ]"
    />
  </template>
</OCarousel>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'number', default: '0', description: 'Index of the currently active slide.' },
    { name: 'loop', type: 'boolean', default: 'false', description: 'Enable infinite looping of slides.' },
    { name: 'autoplay', type: 'boolean', default: 'false', description: 'Automatically advance slides.' },
    { name: 'autoplayInterval', type: 'number', default: '5000', description: 'Interval in milliseconds between auto-advances.' },
    { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Pause autoplay when the user hovers over the carousel.' },
    { name: 'showDots', type: 'boolean', default: 'true', description: 'Show dot indicators below the carousel.' },
    { name: 'showArrows', type: 'boolean', default: 'true', description: 'Show navigation arrows.' },
    { name: 'slidesPerView', type: 'number', default: '1', description: 'Number of slides visible at once.' },
    { name: 'gap', type: 'number', default: '0', description: 'Gap in pixels between slides.' },
  ],

  slots: [
    { name: 'default', type: '-', description: 'Slide content. Each direct child becomes a slide.' },
    { name: 'arrow-left', type: '{ prev, canGoPrev }', description: 'Custom content for the left navigation arrow.' },
    { name: 'arrow-right', type: '{ next, canGoNext }', description: 'Custom content for the right navigation arrow.' },
    { name: 'dot', type: '{ index, active }', description: 'Custom dot indicator rendering per slide.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '(index: number) => void', description: 'Fired when the active slide changes.' },
    { name: 'change', type: '(index: number) => void', description: 'Fired after a slide transition completes.' },
  ],

  bestPractices: [
    { text: 'Provide visible navigation controls (arrows or dots) so users can control the carousel.', good: true },
    { text: 'Pause autoplay on hover or focus to give users time to read content.', good: true },
    { text: 'Use autoplay without a pause mechanism for important content.', good: false },
    { text: 'Rely solely on swipe gestures without visible controls.', good: false },
  ],
}
