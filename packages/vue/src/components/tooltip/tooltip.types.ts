import type { Placement } from '@floating-ui/vue'

export interface TooltipProps {
  /** Text content of the tooltip. */
  content: string
  /** Placement relative to the trigger. */
  placement?: Placement
  /** Offset in px from the trigger. */
  offset?: number
  /** Show an arrow pointing to the trigger. */
  showArrow?: boolean
  /** Delay in ms before showing. */
  delay?: number
  /** Delay in ms before hiding. */
  closeDelay?: number
  /** Whether the tooltip is disabled. */
  disabled?: boolean
  /** Additional CSS classes on the tooltip bubble. */
  class?: string
}
