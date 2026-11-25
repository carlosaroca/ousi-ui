export type MeterColor = 'default' | 'accent' | 'success' | 'warning' | 'danger'
export type MeterSize = 'sm' | 'md' | 'lg'

export interface MeterSegment {
  /** Unique key. Falls back to the label. */
  id?: string
  label: string
  /** An amount, on the same scale as `maxValue`. */
  value: number
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
}

export interface MeterProps {
  /** Current value. Required unless `segments` is given. */
  value?: number
  /** Several amounts on one bar, in order: what takes up a quota, say. They replace `value` and
   *  `color`. If they add up to more than the range, the bar is shared among them. */
  segments?: MeterSegment[]
  /** Space between segments, in px, curved around the round end of the next one. 0 joins them. */
  gap?: number
  /** Segments touch, with no space between them. */
  joined?: boolean
  /** With `segments`: list under the bar what each one is and how much. */
  showLegend?: boolean
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
