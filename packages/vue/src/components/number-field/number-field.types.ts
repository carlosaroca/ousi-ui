export type NumberFieldShadow = 'none' | 'xs' | 'sm' | 'md'

export interface NumberFieldProps {
  /** Current value (v-model). */
  modelValue?: number | null
  /** Default value. */
  defaultValue?: number | null
  /** Minimum value. */
  min?: number
  /** Maximum value. */
  max?: number
  /** Step for increment/decrement. Default: 1. */
  step?: number
  /** Label text. */
  label?: string
  /** Description text. */
  description?: string
  /** Error message. */
  errorMessage?: string
  /** Placeholder text. */
  placeholder?: string
  /** Field name for form context. */
  name?: string
  /** Visual variant. */
  variant?: 'primary' | 'secondary'
  /** Elevation shadow. Defaults to 'xs'. */
  shadow?: NumberFieldShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Size. */
  size?: 'sm' | 'md' | 'lg'
  /** Disable the field. */
  disabled?: boolean
  /** Read-only mode. */
  readonly?: boolean
  /** Required. */
  required?: boolean
  /** Intl.NumberFormat options for display. */
  formatOptions?: Intl.NumberFormatOptions
  /** Locale for formatting. */
  locale?: string
  /** Show increment/decrement buttons. Default: true. */
  showButtons?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface NumberFieldEmits {
  'update:modelValue': [value: number | null]
  'change': [value: number | null]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}
