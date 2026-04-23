export interface TimeFieldValue {
  hour: number
  minute: number
  second?: number
}

export type TimeFieldGranularity = 'hour' | 'minute' | 'second'
export type TimeFieldShadow = 'none' | 'xs' | 'sm' | 'md'

export interface TimeFieldProps {
  /** Current time value (v-model). */
  modelValue?: TimeFieldValue | null
  /** Default time value. */
  defaultValue?: TimeFieldValue | null
  /** Use 24-hour format. */
  hour12?: boolean
  /** Granularity of the picker. */
  granularity?: TimeFieldGranularity
  /** Minimum allowed time. */
  min?: TimeFieldValue
  /** Maximum allowed time. */
  max?: TimeFieldValue
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
