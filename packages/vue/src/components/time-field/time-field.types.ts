export interface TimeFieldValue {
  hour: number
  minute: number
  second?: number
}

export type TimeFieldGranularity = 'hour' | 'minute' | 'second'
export type TimeFieldShadow = 'none' | 'xs' | 'sm' | 'md'
export type TimeFieldSize = 'sm' | 'md' | 'lg'
export type TimeFieldVariant = 'primary' | 'secondary'

export interface TimeFieldProps {
  /** Current time value (v-model). */
  modelValue?: TimeFieldValue | null
  /** Default time value. */
  defaultValue?: TimeFieldValue | null
  /** Locale used to infer hour12 when not explicitly set. Falls back to the
   *  global config (useOusiConfig). */
  locale?: string
  /** 12-hour format with an AM/PM segment. When omitted, inferred from the locale. */
  hour12?: boolean
  /** Granularity of the picker. */
  granularity?: TimeFieldGranularity
  /** Minimum allowed time. */
  min?: TimeFieldValue
  /** Maximum allowed time. */
  max?: TimeFieldValue
  /** Visual variant. Defaults to 'primary'. */
  variant?: TimeFieldVariant
  /** Size of the field. Defaults to 'md'. */
  size?: TimeFieldSize
  /** Elevation shadow. Defaults to 'xs'. */
  shadow?: TimeFieldShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Disable the field. */
  disabled?: boolean
  /** Mark field as read-only. */
  readOnly?: boolean
  /** Accessible label. */
  label?: string
  /** Additional CSS classes. */
  class?: string
}

export interface TimeFieldEmits {
  'update:modelValue': [value: TimeFieldValue | null]
  'change': [value: TimeFieldValue | null]
}

export type TimeSegmentType = 'hour' | 'minute' | 'second' | 'dayPeriod' | 'literal'

export interface TimeSegment {
  type: TimeSegmentType
  text: string
  value?: number | string
  placeholder: string
}
