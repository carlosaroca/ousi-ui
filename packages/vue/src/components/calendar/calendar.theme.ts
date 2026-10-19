export const calendarTheme = 'w-72 max-w-full'

export const calendarHeaderTheme = 'flex items-center gap-1 pb-3'

export const calendarHeadingTheme = 'flex-1 text-center text-sm font-semibold text-ousi-foreground'

export const calendarNavButtonTheme = [
  'flex size-8 shrink-0 items-center justify-center rounded-ousi-lg border border-ousi-border/70',
  'text-ousi-muted cursor-pointer',
  'transition-colors duration-150',
  'hover:bg-ousi-default hover:text-ousi-foreground',
  'active:scale-95',
  'disabled:opacity-50 disabled:pointer-events-none',
].join(' ')

export const calendarGridTheme = 'grid grid-cols-7 gap-1 w-full'

export const calendarHeaderCellTheme = [
  'flex items-center justify-center pb-1',
  'text-xs font-medium text-ousi-muted',
].join(' ')

export interface CellStates {
  isSelected: boolean
  isToday: boolean
  isOutsideMonth: boolean
  isDisabled: boolean
  isUnavailable: boolean
}

export function calendarCellTheme(s: CellStates, customCell = false): string {
  const base = [
    'relative flex aspect-square w-full items-center justify-center',
    'rounded-ousi-lg text-center text-sm outline-none select-none',
    'focus-visible:ring-2 focus-visible:ring-ousi-focus',
    'transition-colors duration-150',
  ]

  if (s.isDisabled || s.isUnavailable) {
    base.push('opacity-50 pointer-events-none')
    if (s.isDisabled) base.push('line-through')
  } else {
    base.push('cursor-pointer')
  }

  // When #cell slot is used, the button is transparent — slot handles all visuals
  if (customCell) return base.join(' ')

  if (s.isOutsideMonth) {
    base.push('text-ousi-muted opacity-50')
  } else if (s.isSelected) {
    base.push('bg-ousi-accent text-ousi-accent-foreground font-medium')
  } else if (s.isToday) {
    base.push('bg-ousi-surface-secondary text-ousi-foreground font-semibold hover:bg-ousi-default')
  } else {
    base.push('text-ousi-foreground hover:bg-ousi-default')
  }

  return base.join(' ')
}

// Cell indicator dot
export const calendarCellIndicatorTheme = (isSelected: boolean) => [
  'absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full',
  'size-1',
  isSelected ? 'bg-ousi-accent-foreground' : 'bg-ousi-muted',
].join(' ')

// Year picker trigger (clickable heading)
export const calendarYearPickerTriggerTheme = [
  'flex flex-1 items-center justify-center gap-1 cursor-pointer',
  'text-sm font-semibold text-ousi-foreground',
  'hover:text-ousi-accent transition-colors duration-150',
].join(' ')

// Year picker grid overlay
export const calendarYearPickerGridTheme = [
  'grid grid-cols-4 gap-2 p-2',
].join(' ')

// Year picker cell
export function calendarYearCellTheme(isSelected: boolean, isCurrent: boolean): string {
  const base = [
    'flex items-center justify-center rounded-ousi-xl',
    'py-2 text-sm cursor-pointer select-none',
    'transition-colors duration-150',
  ]

  if (isSelected) {
    base.push('bg-ousi-accent text-ousi-accent-foreground font-medium')
  } else if (isCurrent) {
    base.push('text-ousi-accent font-semibold hover:bg-ousi-default')
  } else {
    base.push('text-ousi-foreground hover:bg-ousi-default')
  }

  return base.join(' ')
}
