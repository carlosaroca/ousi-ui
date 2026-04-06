export type MeterColor = 'default' | 'accent' | 'success' | 'warning' | 'danger'
export type MeterSize = 'sm' | 'md' | 'lg'

export interface MeterProps {
  /** Current value (required — always determinate). */
  value: number
  /** Minimum value. Default: 0. */
  minValue?: number
  /** Maximum value. Default: 100. */
  maxValue?: number
  /** Label text. */
  label?: string
  /** Show formatted value to the right. */
  showValueLabel?: boolean
  /** Intl.NumberFormat options for the value label. */
  formatOptions?: Intl.NumberFormatOptions
  /** Fill color. */
  color?: MeterColor
  /** Track height. */
  size?: MeterSize
  /** Automatically change color based on thresholds. */
  autoColor?: boolean
  /** Low threshold (default: 25% of range). */
  low?: number
  /** High threshold (default: 75% of range). */
  high?: number
  /** Optimum value — determines whether high or low is "good". */
  optimum?: number
  /** Disable the meter. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}
