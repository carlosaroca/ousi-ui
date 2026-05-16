import type { TimeFieldValue, TimeFieldGranularity } from '../time-field/time-field.types'

export type TimePickerShadow = 'none' | 'xs' | 'sm' | 'md'
export type TimePickerSize = 'sm' | 'md' | 'lg'
export type TimePickerInterval = 1 | 5 | 10 | 15 | 30 | 60

export interface TimePickerProps {
  /** Current time value (v-model). */
  modelValue?: TimeFieldValue | null
  /** Default time value. */
  defaultValue?: TimeFieldValue | null
  /** Label text. */
  label?: string
  /** Description text below the field. */
  description?: string
  /** Error message — replaces description when present. */
  errorMessage?: string
  /** Locale for AM/PM labels and clock conventions. Falls back to the global
   *  config (useOusiConfig). */
  locale?: string
  /** 12-hour format with an AM/PM column. When omitted, inferred from the locale. */
  hour12?: boolean
  /** Granularity of the picker. Defaults to 'minute'. */
  granularity?: TimeFieldGranularity
  /** Step in minutes for the minute wheel. Defaults to 5. */
  interval?: TimePickerInterval
  /** Minimum allowed time. */
  min?: TimeFieldValue
  /** Maximum allowed time. */
  max?: TimeFieldValue
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
  size?: TimePickerSize
  /** Elevation shadow on the trigger. Defaults to 'xs'. */
  shadow?: TimePickerShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Show "Now" button in the popover. Defaults to true. */
  showNow?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface TimePickerEmits {
  'update:modelValue': [value: TimeFieldValue | null]
  'change': [value: TimeFieldValue | null]
}
