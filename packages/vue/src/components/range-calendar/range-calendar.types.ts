import type { CalendarDate } from '../calendar/calendar.types'

export type { CalendarDate }

export interface DateRange {
  start: CalendarDate | null
  end: CalendarDate | null
}

export interface RangeCalendarProps {
  /** Selected range (v-model). */
  modelValue?: DateRange | null
  /** Default range. */
  defaultValue?: DateRange | null
  /** Minimum selectable date. */
  minValue?: CalendarDate
  /** Maximum selectable date. */
  maxValue?: CalendarDate
  /** Dates not available. */
  unavailableDates?: CalendarDate[]
  /** Locale for month/day names. */
  locale?: string
  /** Show adjacent month days. */
  showOutsideDays?: boolean
  /** Prevent selection. */
  readonly?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface RangeCalendarEmits {
  'update:modelValue': [range: DateRange | null]
  'change': [range: DateRange | null]
}
