import type { Component } from 'vue'
import type { HapticInput } from '@ousi-ui/haptics'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'soft' | 'danger' | 'danger-soft'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShadow = 'none' | 'xs' | 'sm' | 'md'

export interface ButtonProps {
  /** Visual variant of the button. */
  variant?: ButtonVariant
  /** Size of the button. */
  size?: ButtonSize
  /** Whether the button is disabled. */
  disabled?: boolean
  /** Whether the button is in a loading state. */
  loading?: boolean
  /** Render as an icon-only button (square, no text padding). */
  isIconOnly?: boolean
  /** Stretch to fill parent width. */
  fullWidth?: boolean
  /** Elevation shadow. Defaults to 'none'. */
  shadow?: ButtonShadow
  /** HTML type attribute. */
  type?: 'button' | 'submit' | 'reset'
  /** Renders the button as a different element or component. */
  as?: string | Component
  /** Haptic feedback on click. Pass false to disable. */
  haptic?: HapticInput
  /** Additional CSS classes (merged, never replaced). */
  class?: string
}

export interface ButtonSlots {
  /** Default slot for button content. */
  default?: () => unknown
  /** Slot for content before the default slot (e.g., icon). */
  start?: () => unknown
  /** Slot for content after the default slot (e.g., icon). */
  end?: () => unknown
  /** Custom loading indicator. */
  loading?: () => unknown
}
