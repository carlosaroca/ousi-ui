import type { Component } from 'vue'

export type InputShadow = 'none' | 'xs' | 'sm' | 'md'

export interface InputProps {
  /** Controlled value (v-model). */
  modelValue?: string | number
  /** Default value when uncontrolled. */
  defaultValue?: string | number
  /** HTML input type. */
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'
  /** Placeholder text. */
  placeholder?: string
  /** Label text shown above the input. */
  label?: string
  /** Help text shown below the input. */
  description?: string
  /** Field name — used for form context error matching. */
  name?: string
  /** Error message — activates error state. */
  errorMessage?: string
  /** Size of the input. */
  size?: 'sm' | 'md' | 'lg'
  /** Visual variant. */
  variant?: 'primary' | 'secondary'
  /** Elevation shadow. Defaults to 'xs'. */
  shadow?: InputShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Whether the input is disabled. */
  disabled?: boolean
  /** Whether the input is read-only. */
  readonly?: boolean
  /** Whether the input is required. */
  required?: boolean
  /** Show a clear button when there is a value. */
  clearable?: boolean
  /** Show a loading spinner in the end slot. */
  loading?: boolean
  /** Renders the wrapper as a different element or component. */
  as?: string | Component
  /** Additional CSS classes on the outer container (merged, never replaced). */
  class?: string
}

export interface InputEmits {
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
}
