export type ColorChannel = 'hue' | 'saturation' | 'lightness' | 'alpha' | 'red' | 'green' | 'blue'
export type SliderOrientation = 'horizontal' | 'vertical'

export interface ColorSliderProps {
  /** Which color channel this slider controls. */
  channel: ColorChannel
  /** Current value (v-model). */
  modelValue?: number
  /** Default value. */
  defaultValue?: number
  /** Label text. */
  label?: string
  /** Show numeric output. */
  showOutput?: boolean
  /** Layout direction. */
  orientation?: SliderOrientation
  /** Disable interaction. */
  disabled?: boolean
  /** Context color for gradient generation. */
  contextColor?: {
    h?: number; s?: number; l?: number; a?: number
    r?: number; g?: number; b?: number
  }
  /** Additional CSS classes. */
  class?: string
}

export interface ColorSliderEmits {
  'update:modelValue': [value: number]
  'change': [value: number]
}

export const CHANNEL_RANGES: Record<ColorChannel, { min: number; max: number; step: number }> = {
  hue:        { min: 0, max: 360, step: 1 },
  saturation: { min: 0, max: 100, step: 1 },
  lightness:  { min: 0, max: 100, step: 1 },
  alpha:      { min: 0, max: 1, step: 0.01 },
  red:        { min: 0, max: 255, step: 1 },
  green:      { min: 0, max: 255, step: 1 },
  blue:       { min: 0, max: 255, step: 1 },
}
