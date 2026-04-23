export type SliderOrientation = 'horizontal' | 'vertical'
export type SliderValue = number | [number, number]
export type SliderSize = 'sm' | 'md' | 'lg'
export type SliderColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
export type SliderShadow = 'none' | 'xs' | 'sm'

export interface SliderProps {
  /** Current value — number for single, [min, max] for range. */
  modelValue?: SliderValue
  /** Default value. */
  defaultValue?: SliderValue
  /** Minimum. Default: 0. */
  min?: number
  /** Maximum. Default: 100. */
  max?: number
  /** Step increment. Default: 1. */
  step?: number
  /** Label text. */
  label?: string
  /** Show formatted value output. */
  showOutput?: boolean
  /** Intl.NumberFormat options for the output. */
  formatOptions?: Intl.NumberFormatOptions
  /** Orientation. */
  orientation?: SliderOrientation
  /** Track/thumb size. */
  size?: SliderSize
  /** Fill color. */
  color?: SliderColor
  /** Elevation shadow on the track. Defaults to 'none'. */
  shadow?: SliderShadow
  /** Disable interaction. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface SliderEmits {
  'update:modelValue': [value: SliderValue]
  'change': [value: SliderValue]
}
