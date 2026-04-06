export interface CarouselProps {
  modelValue?: number
  defaultValue?: number
  loop?: boolean
  autoplay?: boolean
  autoplayInterval?: number
  pauseOnHover?: boolean
  showDots?: boolean
  showArrows?: boolean
  slidesPerView?: number
  gap?: number
  class?: string
}

export interface CarouselEmits {
  'update:modelValue': [index: number]
  'change': [index: number]
}

/**
 * Carousel slots:
 *
 * - `default` — Slide content (each direct child becomes a slide)
 * - `arrow-left` — Custom left arrow content. Receives `{ prev, canGoPrev }`.
 * - `arrow-right` — Custom right arrow content. Receives `{ next, canGoNext }`.
 * - `dot` — Custom dot rendering. Receives `{ index, active }`.
 */
export interface CarouselSlots {
  'default': () => any
  'arrow-left': (props: { prev: () => void; canGoPrev: boolean }) => any
  'arrow-right': (props: { next: () => void; canGoNext: boolean }) => any
  'dot': (props: { index: number; active: boolean }) => any
}
