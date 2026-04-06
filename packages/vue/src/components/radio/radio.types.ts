import type { HapticInput } from '@ousi-ui/haptics'

export type RadioGroupOrientation = 'vertical' | 'horizontal'

export interface RadioProps {
  /** Unique value for this radio option. */
  value: string
  /** Label text. */
  label?: string
  /** Help text below the label. */
  description?: string
  /** Whether this radio is disabled. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface RadioGroupProps {
  /** Selected value (v-model). */
  modelValue?: string
  /** Default selected value. */
  defaultValue?: string
  /** Layout orientation. */
  orientation?: RadioGroupOrientation
  /** Group label. */
  label?: string
  /** Group description. */
  description?: string
  /** Error message — activates error state. */
  errorMessage?: string
  /** Whether a selection is required. */
  required?: boolean
  /** Disable all radios in the group. */
  disabled?: boolean
  /** Haptic feedback on selection. Pass false to disable. */
  haptic?: HapticInput
  /** Additional CSS classes. */
  class?: string
}

export interface RadioGroupEmits {
  'update:modelValue': [value: string]
  'change': [value: string]
}
