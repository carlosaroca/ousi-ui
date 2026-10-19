export interface AutocompleteOption {
  value: string | number
  label: string
  disabled?: boolean
}

export type AutocompleteShadow = 'none' | 'xs' | 'sm' | 'md'

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
  /** Elevation shadow on the trigger. Defaults to 'xs'. */
  shadow?: AutocompleteShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Show fade shadow at top/bottom of list when scrollable. Defaults to true. */
  scrollShadow?: boolean
  /** Whether the field is disabled. */
  disabled?: boolean
  /** Whether the field is read-only. */
  readonly?: boolean
  /** Whether a value is required. */
  required?: boolean
  /** Show clear button. */
  clearable?: boolean
  /** Allow values not in the options list. */
  allowCustomValue?: boolean
  /** Message when no results match. Defaults to the locale's "no results" text. */
  emptyMessage?: string
  /** Filter the options by the typed text (accents and case ignored). Set it to false when the
   *  app searches on the server and passes the results as they come. Defaults to true. */
  filter?: boolean
  /** Shows a spinner in the field and a loading row while the options are on their way. */
  loading?: boolean
  /** Searches on the server instead of filtering `options`: called with the typed text once it
   *  has `minChars` and the user pauses for `debounce` ms; late answers are dropped. `options`
   *  then only seeds the current value (for its label). */
  search?: (query: string) => Promise<AutocompleteOption[]>
  /** Characters before `search` runs. Defaults to 2. */
  minChars?: number
  /** Pause in ms before `search` runs. Defaults to 250. */
  debounce?: number
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
