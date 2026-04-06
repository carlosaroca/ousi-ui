import type { DateFieldValue } from '../date-field/date-field.types'

export interface DatePickerProps {
  /** Current date value (v-model). */
  modelValue?: DateFieldValue | null
  /** Default date value. */
  defaultValue?: DateFieldValue | null
  /** Label text. */
  label?: string
  /** Description text below the field. */
  description?: string
  /** Error message — replaces description when present. */
  errorMessage?: string
  /** Locale for segment ordering and month names. */
  locale?: string
  /** Minimum selectable date. */
  minValue?: DateFieldValue
  /** Maximum selectable date. */
  maxValue?: DateFieldValue
  /** Dates that cannot be selected. */
  unavailableDates?: DateFieldValue[]
  /** Show days from adjacent months. */
  showOutsideDays?: boolean
  /** Popover placement relative to trigger. */
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
  /** Disable the picker. */
  disabled?: boolean
  /** Read-only mode. */
  readonly?: boolean
  /** Mark as required (shows asterisk on label). */
  required?: boolean
  /** Make the field take full width. */
  fullWidth?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface DatePickerEmits {
  'update:modelValue': [value: DateFieldValue | null]
  'change': [value: DateFieldValue | null]
}
