export type BadgeColor = 'default' | 'accent' | 'success' | 'warning' | 'danger'
export type BadgeVariant = 'primary' | 'secondary' | 'soft'
export type BadgeSize = 'sm' | 'md' | 'lg'
export type BadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface BadgeProps {
  /** Text or number inside the badge. */
  content?: string | number
  /** Color scheme. */
  color?: BadgeColor
  /** Visual variant. */
  variant?: BadgeVariant
  /** Size of the badge. */
  size?: BadgeSize
  /** Position when anchored on an element. */
  placement?: BadgePlacement
  /** Show badge when content is 0. */
  showZero?: boolean
  /** If content > max, shows "max+". */
  max?: number
  /** Show as a small dot without content. */
  dot?: boolean
  /** Hide the badge without removing from DOM. */
  invisible?: boolean
  /** Additional CSS classes. */
  class?: string
}
