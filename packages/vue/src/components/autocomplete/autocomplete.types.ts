export interface AutocompleteOption {
  value: string | number
  label: string
  disabled?: boolean
}

export type AutocompleteShadow = 'none' | 'xs' | 'sm' | 'md'

/** One value, or with `multiple` a list of them. */
export type AutocompleteValue = string | number | (string | number)[]

export interface AutocompleteProps {
  /** Selected value (v-model). With `multiple`, an array in the order they were picked. */
  modelValue?: AutocompleteValue
  /** Default value when uncontrolled. */
  defaultValue?: AutocompleteValue
  /** Pick several: they show as chips in the field, and the list stays open. With
   *  `allowCustomValue`, what is typed can be added too. */
  multiple?: boolean
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
  /** Pick the only enabled option when the field is empty. Defaults to the global `autoSelectSingle` config for required fields. */
  autoSelectSingle?: boolean
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

/** The values are typed loosely on purpose: `v-model` then takes a ref of one value, as it always
 *  has, or of a list with `multiple`. */
export interface AutocompleteEmits {
  'update:modelValue': [value: any]
  'change': [value: any]
  'inputChange': [query: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
}
