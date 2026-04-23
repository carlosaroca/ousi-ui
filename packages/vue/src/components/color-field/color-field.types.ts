export type ColorFieldShadow = 'none' | 'xs' | 'sm' | 'md'

export interface ColorFieldProps {
  /** Color value (v-model). Any valid CSS color. */
  modelValue?: string
  /** Default color value. */
  defaultValue?: string
  /** Label text. */
  label?: string
  /** Help text. */
  description?: string
  /** Error message — overrides internal validation error. */
  errorMessage?: string
  /** Output format. */
  format?: 'hex' | 'rgb' | 'hsl'
  /** Show color preview swatch. */
  showSwatch?: boolean
  /** Visual variant. */
  variant?: 'primary' | 'secondary'
  /** Elevation shadow. Defaults to 'xs'. */
  shadow?: ColorFieldShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Whether the field is disabled. */
  disabled?: boolean
  /** Whether the field is read-only. */
  readonly?: boolean
  /** Whether a value is required. */
  required?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface ColorFieldEmits {
  'update:modelValue': [value: string]
  'change': [value: string]
  'invalidColor': [value: string]
}
