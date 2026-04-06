// Reuse calendar base styles
export { calendarTheme as rangeCalendarTheme } from '../calendar/calendar.theme'
export { calendarHeaderTheme as rangeCalendarHeaderTheme } from '../calendar/calendar.theme'
export { calendarHeadingTheme as rangeCalendarHeadingTheme } from '../calendar/calendar.theme'
export { calendarNavButtonTheme as rangeCalendarNavButtonTheme } from '../calendar/calendar.theme'
export { calendarGridTheme as rangeCalendarGridTheme } from '../calendar/calendar.theme'
export { calendarHeaderCellTheme as rangeCalendarHeaderCellTheme } from '../calendar/calendar.theme'

// Cell wrapper — forms the range track
export function rangeCalendarCellTheme(s: {
  isInRange: boolean
  isStart: boolean
  isEnd: boolean
  isOutsideMonth: boolean
  isDisabled: boolean
  isUnavailable: boolean
  colIndex: number
}): string {
  const base = ['relative outline-none']

  if (s.isDisabled || s.isUnavailable) {
    base.push('opacity-50 pointer-events-none')
    if (s.isDisabled) base.push('line-through')
  } else {
    base.push('cursor-pointer')
  }

  if (s.isOutsideMonth) {
    base.push('opacity-40')
    return base.join(' ')
  }

  // Range track background
  if (s.isInRange && !s.isStart && !s.isEnd) {
    base.push('bg-ousi-accent-soft')
    // Caps at week boundaries
    if (s.colIndex === 0) base.push('rounded-l-full')
    if (s.colIndex === 6) base.push('rounded-r-full')
  }

  // Start cap
  if (s.isStart) {
    base.push('bg-ousi-accent-soft rounded-l-full')
  }

  // End cap
  if (s.isEnd) {
    base.push('bg-ousi-accent-soft rounded-r-full')
  }

  // Single day selection (start === end)
  if (s.isStart && s.isEnd) {
    base.push('!rounded-full !bg-transparent')
  }

  return base.join(' ')
}

// Inner button — the circle that shows the day number
export function rangeCalendarCellButtonTheme(s: {
  isStart: boolean
  isEnd: boolean
  isToday: boolean
  isOutsideMonth: boolean
}): string {
  const base = [
    'flex aspect-square w-full items-center justify-center',
    'rounded-full text-sm outline-none select-none',
    'transition-colors duration-150',
  ]

  if (s.isOutsideMonth) {
    base.push('text-ousi-muted')
  } else if (s.isStart || s.isEnd) {
    base.push('bg-ousi-accent text-ousi-accent-foreground font-medium')
  } else if (s.isToday) {
    base.push('text-ousi-accent font-semibold hover:bg-ousi-default')
  } else {
    base.push('text-ousi-foreground hover:bg-ousi-default')
  }

  return base.join(' ')
}
