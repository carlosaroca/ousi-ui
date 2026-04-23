export interface DateFieldValue {
  year: number
  month: number
  day: number
}

export type DateFieldGranularity = 'day' | 'month' | 'year'
export type DateFieldShadow = 'none' | 'xs' | 'sm' | 'md'

export interface DateFieldProps {
  /** Current date value (v-model). */
  modelValue?: DateFieldValue | null
  /** Default date value. */
  defaultValue?: DateFieldValue | null
  /** Locale for segment ordering (e.g. 'en-US', 'ja-JP'). */
  locale?: string
  /** Granularity of the picker. */
  granularity?: DateFieldGranularity
  /** Minimum allowed date. */
  min?: DateFieldValue
  /** Maximum allowed date. */
  max?: DateFieldValue
  /** Elevation shadow. Defaults to 'xs'. */
  shadow?: DateFieldShadow
  /** Enable tactile press animation (scale on focus). Defaults to false. */
  animated?: boolean
  /** Disable the field. */
  disabled?: boolean
  /** Mark field as read-only. */
  readOnly?: boolean
  /** Accessible label. */
  label?: string
  /** Placeholder text per segment. */
  placeholder?: Partial<Record<'year' | 'month' | 'day', string>>
  /** Additional CSS classes. */
  class?: string
}

export interface DateFieldEmits {
  'update:modelValue': [value: DateFieldValue | null]
  'change': [value: DateFieldValue | null]
}

export type SegmentType = 'year' | 'month' | 'day' | 'literal'

export interface Segment {
  type: SegmentType
  text: string
  value?: number
  placeholder: string
}
