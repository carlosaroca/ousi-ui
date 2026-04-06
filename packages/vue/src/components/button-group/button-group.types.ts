export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupProps {
  /** Layout direction. */
  orientation?: ButtonGroupOrientation
  /** Stretch buttons to fill parent width. */
  fullWidth?: boolean
  /** Additional CSS classes. */
  class?: string
}
