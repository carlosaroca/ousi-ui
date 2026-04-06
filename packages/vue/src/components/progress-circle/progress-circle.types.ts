export type ProgressCircleColor = 'default' | 'accent' | 'success' | 'warning' | 'danger'
export type ProgressCircleSize = 'sm' | 'md' | 'lg'

export interface ProgressCircleProps {
  /** Current value (0-100). Undefined = indeterminate. */
  value?: number
  /** Minimum value. */
  minValue?: number
  /** Maximum value. */
  maxValue?: number
  /** Fill color. */
  color?: ProgressCircleColor
  /** Size of the circle. */
  size?: ProgressCircleSize
  /** SVG stroke width. */
  strokeWidth?: number
  /** Show percentage in the center. */
  showValueLabel?: boolean
  /** Accessible label. */
  label?: string
  /** Disable the progress circle. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}
