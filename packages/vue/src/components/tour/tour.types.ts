import type { Placement } from '@floating-ui/vue'

export type TourPlacement = Placement
export type TourShadow = 'md' | 'lg' | 'xl' | '2xl'

export interface TourStep {
  /** Unique key. Falls back to the position. */
  id?: string
  /** The part of the page this step is about: a CSS selector, an element or a function returning
   *  one. Without it, or if it cannot be found, the step shows in the middle of the screen. */
  target?: string | Element | (() => Element | null | undefined)
  title: string
  description?: string
  /** Preferred side of the target. It flips when there is no room. */
  placement?: TourPlacement
  /** Lets the highlighted part be used during this step, with pointer and keyboard. */
  interactive?: boolean
}

export interface TourProps {
  steps: TourStep[]
  /** Whether the tour is running (v-model). */
  modelValue?: boolean
  /** The current step, from 0 (v-model:step). Optional: uncontrolled, every run starts at the first. */
  step?: number
  /** Space between the target and the edge of the highlight, in px. */
  padding?: number
  /** Show where the tour is: a dot per step and "2 of 5". */
  showProgress?: boolean
  /** Show the button that leaves the tour. */
  showCloseButton?: boolean
  /** Leave the tour with Escape. */
  closeOnEscape?: boolean
  shadow?: TourShadow
  /** Additional CSS classes on the card. The highlight's corners follow `--tour-radius`. */
  class?: string
}

export interface TourEmits {
  'update:modelValue': [open: boolean]
  'update:step': [step: number]
  /** The last step was completed. */
  'finish': []
  /** Left before the end, at this step. */
  'skip': [step: number]
}

export interface TourSlotContext {
  step: TourStep
  index: number
  total: number
  next: () => void
  prev: () => void
  close: () => void
}

export interface TourSlots {
  /** More content under the description. */
  default?: (props: TourSlotContext) => unknown
  /** Replaces the progress and the buttons. */
  footer?: (props: TourSlotContext) => unknown
}
