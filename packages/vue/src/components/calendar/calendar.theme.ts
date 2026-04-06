export const calendarTheme = 'w-64 max-w-full'

export const calendarHeaderTheme = 'flex items-center justify-between px-0.5 pb-4'

export const calendarHeadingTheme = 'flex-1 text-center text-sm font-medium text-ousi-foreground'

export const calendarNavButtonTheme = [
  'flex size-7 items-center justify-center rounded-full',
  'text-ousi-muted cursor-pointer',
  'transition-colors duration-150',
  'hover:bg-ousi-default hover:text-ousi-foreground',
  'active:scale-95',
  'disabled:opacity-50 disabled:pointer-events-none',
].join(' ')

export const calendarGridTheme = 'grid grid-cols-7 w-full'

export const calendarHeaderCellTheme = [
  'flex items-center justify-center pb-2',
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
    'rounded-full text-center text-sm outline-none select-none',
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
    base.push('text-ousi-muted opacity-40')
  } else if (s.isSelected) {
    base.push('bg-ousi-accent text-ousi-accent-foreground font-medium')
  } else if (s.isToday) {
    base.push('text-ousi-accent font-semibold')
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
  'flex items-center justify-center gap-1 cursor-pointer',
  'text-sm font-medium text-ousi-foreground',
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
