export type ButtonGroupOrientation = 'horizontal' | 'vertical'
export type ButtonGroupShadow = 'none' | 'xs' | 'sm' | 'md'

export interface ButtonGroupProps {
  /** Layout direction. */
  orientation?: ButtonGroupOrientation
  /** Stretch buttons to fill parent width. */
  fullWidth?: boolean
  /** Elevation shadow. Defaults to 'none'. */
  shadow?: ButtonGroupShadow
  /** Additional CSS classes. */
  class?: string
}
