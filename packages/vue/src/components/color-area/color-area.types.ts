export interface ColorAreaValue {
  /** Saturation 0-100 (X axis, left=0, right=100). */
  x: number
  /** Brightness/Value 0-100 (Y axis, bottom=0, top=100). */
  y: number
}

export interface ColorAreaProps {
  /** Current value (v-model). */
  modelValue?: ColorAreaValue
  /** Default value. */
  defaultValue?: ColorAreaValue
  /** Hue angle 0-360. */
  hue?: number
  /** Show dots overlay pattern. */
  showDots?: boolean
  /** Disable interaction. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface ColorAreaEmits {
  'update:modelValue': [value: ColorAreaValue]
  'change': [value: ColorAreaValue]
}
