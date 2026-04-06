export const dateFieldWrapperTheme = [
  'inline-flex min-h-9 items-center overflow-hidden rounded-ousi-field',
  'border bg-ousi-field text-sm text-ousi-field-foreground shadow-ousi-field outline-none',
  'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
  'transition-[background-color,border-color,box-shadow] duration-150',
  'hover:not-focus-within:bg-ousi-field-hover',
  'focus-within:ring-2 focus-within:ring-ousi-focus focus-within:bg-ousi-field-focus',
  'data-[disabled=true]:opacity-[--ousi-disabled-opacity] data-[disabled=true]:pointer-events-none',
].join(' ')

export function dateFieldSegmentTheme(focused: boolean): string {
  const base = 'tabular-nums outline-none rounded-sm px-0.5 select-none caret-transparent'
  if (focused) return `${base} bg-ousi-accent text-ousi-accent-foreground`
  return `${base} text-ousi-field-foreground`
}

export const dateFieldLiteralTheme = 'text-ousi-muted select-none px-px'

export const dateFieldPlaceholderTheme = 'text-ousi-field-placeholder'
