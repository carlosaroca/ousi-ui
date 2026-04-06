export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export type SelectValue = string | number | (string | number)[]

import type { HapticInput } from '@ousi-ui/haptics'

export interface SelectProps {
  /** Controlled value (v-model). Single value or array for multiple. */
  modelValue?: SelectValue
  /** Default value when uncontrolled. */
  defaultValue?: SelectValue
  /** List of options. */
  options: SelectOption[]
  /** Enable multiple selection. */
  multiple?: boolean
  /** Placeholder text when no option is selected. */
  placeholder?: string
  /** Label text shown above the trigger. */
  label?: string
  /** Help text shown below the trigger. */
  description?: string
  /** Field name — used for form context error matching. */
  name?: string
  /** Error message — activates error state. */
  errorMessage?: string
  /** Size of the trigger. */
  size?: 'sm' | 'md' | 'lg'
  /** Visual variant. */
  variant?: 'primary' | 'secondary'
  /** Whether the select is disabled. */
  disabled?: boolean
  /** Whether the select is required. */
  required?: boolean
  /** Stretch to fill parent width. */
  fullWidth?: boolean
  /** Haptic feedback on option select. Pass false to disable. */
  haptic?: HapticInput
  /** Additional CSS classes on the outer container. */
  class?: string
}

export interface SelectEmits {
  'update:modelValue': [value: SelectValue]
  'change': [value: SelectValue]
  'open': []
  'close': []
}
