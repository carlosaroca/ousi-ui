export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerColor = 'current' | 'accent' | 'danger' | 'success' | 'warning'

export interface SpinnerProps {
  /** Size of the spinner. */
  size?: SpinnerSize
  /** Color of the spinner. */
  color?: SpinnerColor
  /** Accessible label. */
  label?: string
  /** Additional CSS classes. */
  class?: string
}
