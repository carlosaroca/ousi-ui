import type { Placement } from '@floating-ui/vue'

export type PopoverShadow = 'sm' | 'md' | 'lg' | 'xl'

export interface PopoverProps {
  /** Placement relative to the trigger. */
  placement?: Placement
  /** Offset in px from the trigger. */
  offset?: number
  /** Show an arrow pointing to the trigger. */
  showArrow?: boolean
  /** Title shown at the top of the popover. */
  title?: string
  /** Elevation shadow. Defaults to 'lg'. */
  shadow?: PopoverShadow
  /** Additional CSS classes on the panel. */
  class?: string
  /** Classes on the element that wraps the trigger, an `inline-flex` box by default. Pass
   *  `flex min-w-0 flex-1` to let a full-width trigger fill and shrink inside a flex row. */
  triggerClass?: string
}

export interface PopoverEmits {
  open: []
  close: []
}
