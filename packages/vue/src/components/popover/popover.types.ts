import type { Placement } from '@floating-ui/vue'

export interface PopoverProps {
  /** Placement relative to the trigger. */
  placement?: Placement
  /** Offset in px from the trigger. */
  offset?: number
  /** Show an arrow pointing to the trigger. */
  showArrow?: boolean
  /** Title shown at the top of the popover. */
  title?: string
  /** Additional CSS classes on the panel. */
  class?: string
}

export interface PopoverEmits {
  open: []
  close: []
}
