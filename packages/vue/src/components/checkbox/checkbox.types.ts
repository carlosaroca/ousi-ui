import type { HapticInput } from '@ousi-ui/haptics'

export interface CheckboxProps {
  /** Controlled checked state (v-model). */
  modelValue?: boolean
  /** Default checked state when uncontrolled. */
  defaultValue?: boolean
  /** Show indeterminate state (overrides checked visually). */
  indeterminate?: boolean
  /** Label text. */
  label?: string
  /** Help text below the label. */
  description?: string
  /** Error message — activates error state. */
  errorMessage?: string
  /** Whether the field is required. */
  required?: boolean
  /** Whether the checkbox is disabled. */
  disabled?: boolean
  /** Whether the checkbox is read-only. */
  readonly?: boolean
  /** Force invalid state without error message. */
  invalid?: boolean
  /** Visual variant. */
  variant?: 'primary' | 'secondary'
  /** Haptic feedback on toggle. Pass false to disable. */
  haptic?: HapticInput
  /** Additional CSS classes. */
  class?: string
}

export interface CheckboxEmits {
  'update:modelValue': [value: boolean]
  'update:indeterminate': [value: boolean]
  'change': [value: boolean]
}
