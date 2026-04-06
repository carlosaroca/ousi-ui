import type { HapticInput } from '@ousi-ui/haptics'

export type PaginationSize = 'sm' | 'md' | 'lg'

export interface PaginationProps {
  /** Current page (1-based, v-model). */
  modelValue?: number
  /** Default page when uncontrolled. */
  defaultPage?: number
  /** Total number of pages (required). */
  total: number
  /** Pages shown on each side of current. Default: 1. */
  siblings?: number
  /** Pages shown at start and end. Default: 1. */
  boundaries?: number
  /** Show Prev/Next buttons. Default: true. */
  showControls?: boolean
  /** Show "Page X of Y" summary. Default: false. */
  showSummary?: boolean
  /** Loop from last to first and vice versa. Default: false. */
  loop?: boolean
  /** Size variant. */
  size?: PaginationSize
  /** Disable all interactions. */
  disabled?: boolean
  /** Text label for prev button (shows icon if undefined). */
  prevLabel?: string
  /** Text label for next button (shows icon if undefined). */
  nextLabel?: string
  /** Haptic feedback on page change. Pass false to disable. */
  haptic?: HapticInput
  /** Additional CSS classes. */
  class?: string
}

export interface PaginationEmits {
  'update:modelValue': [page: number]
  'change': [page: number]
}
