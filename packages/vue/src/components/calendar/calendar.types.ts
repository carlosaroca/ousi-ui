export interface CalendarDate {
  year: number
  month: number
  day: number
}

export interface CalendarProps {
  /** Selected date (v-model). */
  modelValue?: CalendarDate | null
  /** Default selected date. */
  defaultValue?: CalendarDate | null
  /** Minimum selectable date. */
  minValue?: CalendarDate
  /** Maximum selectable date. */
  maxValue?: CalendarDate
  /** Dates that are not available for selection. */
  unavailableDates?: CalendarDate[]
  /** Days with indicators (dots). */
  indicatorDays?: number[]
  /** Locale for month/day names. */
  locale?: string
  /** Show days from previous/next month. */
  showOutsideDays?: boolean
  /** Enable year picker overlay. */
  showYearPicker?: boolean
  /** Prevent selection. */
  readonly?: boolean
  /** Disable the entire calendar. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface CalendarEmits {
  'update:modelValue': [date: CalendarDate | null]
  'change': [date: CalendarDate | null]
}
