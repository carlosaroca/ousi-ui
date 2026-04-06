export interface ColorPickerValue {
  h: number
  s: number
  v: number
  a: number
}

export interface ColorPickerProps {
  /** Current color value (v-model). */
  modelValue?: ColorPickerValue
  /** Default color value. */
  defaultValue?: ColorPickerValue
  /** Label shown next to the trigger swatch. */
  label?: string
  /** Show alpha slider. */
  showAlpha?: boolean
  /** Show hex input field. */
  showHexInput?: boolean
  /** Show preset swatches palette. */
  showSwatches?: boolean
  /** Custom preset colors (hex strings). */
  swatches?: string[]
  /** Popover placement. */
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
  /** Disable the picker. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface ColorPickerEmits {
  'update:modelValue': [value: ColorPickerValue]
  'change': [value: ColorPickerValue]
}

export const DEFAULT_SWATCHES = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
  '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#ec4899', '#64748b',
]
