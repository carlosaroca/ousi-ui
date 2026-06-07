import type { DateFieldValue } from '../date-field/date-field.types'

export type DatePickerShadow = 'none' | 'xs' | 'sm' | 'md'
export type DatePickerSize = 'sm' | 'md' | 'lg'

export interface DatePickerProps {
  /** Current date value (v-model). When `format` is set, accepts/emits a string in that format. */
  modelValue?: DateFieldValue | string | null
  /** Default date value. When `format` is set, accepts a string in that format. */
  defaultValue?: DateFieldValue | string | null
  /** Label text. */
  label?: string
  /** Description text below the field. */
  description?: string
  /** Error message — replaces description when present. */
  errorMessage?: string
  /** Locale for segment ordering and month names. */
  locale?: string
  /** When set, v-model is parsed/emitted as a string in this pattern.
   *  Tokens: `YYYY` `YY` `MM` `M` `DD` `D` — anything else is a literal.
   *  Example: `'YYYY-MM-DD'` → v-model is `'2026-05-29'`. Defaults to unset (object). */
  format?: string
  /** When set, the trigger shows segments in this pattern instead of the locale-derived order.
   *  Uses the same tokens as `format`. Independent from `format` — set both to keep them in sync. */
  displayFormat?: string
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
  /** Visual variant of the field. Defaults to 'primary'. */
  variant?: 'primary' | 'secondary'
  /** Size of the field. Defaults to 'md'. */
  size?: DatePickerSize
  /** Elevation shadow on the trigger. Defaults to 'xs'. */
  shadow?: DatePickerShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface DatePickerEmits {
  'update:modelValue': [value: DateFieldValue | string | null]
  'change': [value: DateFieldValue | string | null]
}
