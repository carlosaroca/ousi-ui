export type ProgressBarColor = 'default' | 'accent' | 'success' | 'warning' | 'danger'
export type ProgressBarSize = 'sm' | 'md' | 'lg'

export interface ProgressBarProps {
  /** Current value (0-100). Undefined = indeterminate. */
  value?: number
  /** Minimum value. */
  minValue?: number
  /** Maximum value. */
  maxValue?: number
  /** Label text. */
  label?: string
  /** Show value percentage on the right. */
  showValueLabel?: boolean
  /** Format options for the value display. */
  formatOptions?: Intl.NumberFormatOptions
  /** Color of the fill bar. */
  color?: ProgressBarColor
  /** Height of the track. */
  size?: ProgressBarSize
  /** Disable the progress bar. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}
