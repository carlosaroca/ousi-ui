export interface AutocompleteOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface AutocompleteProps {
  /** Selected value (v-model). */
  modelValue?: string | number
  /** Default value when uncontrolled. */
  defaultValue?: string | number
  /** List of options to filter. */
  options: AutocompleteOption[]
  /** Placeholder text. */
  placeholder?: string
  /** Label text. */
  label?: string
  /** Help text. */
  description?: string
  /** Error message — activates error state. */
  errorMessage?: string
  /** Visual variant. */
  variant?: 'primary' | 'secondary'
  /** Whether the field is disabled. */
  disabled?: boolean
  /** Whether the field is read-only. */
  readonly?: boolean
  /** Whether a value is required. */
  required?: boolean
  /** Stretch to fill parent width. */
  fullWidth?: boolean
  /** Show clear button. */
  clearable?: boolean
  /** Allow values not in the options list. */
  allowCustomValue?: boolean
  /** Message when no results match. */
  emptyMessage?: string
  /** Additional CSS classes. */
  class?: string
}

export interface AutocompleteEmits {
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
  'inputChange': [query: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
}
