import { cva } from 'class-variance-authority'

/** Outer wrapper — stacks label, trigger, description/error vertically. */
export const datePickerWrapperTheme = cva(
  'inline-flex flex-col gap-1',
  {
    variants: {
      fullWidth: { true: 'w-full', false: 'w-fit' },
    },
    defaultVariants: { fullWidth: false },
  },
)

/** Trigger row — unified field container for segments + icon. Owns ALL field chrome. */
export const datePickerTriggerTheme = [
  'inline-flex w-full items-center min-h-9 rounded-ousi-field px-3 py-2',
  'border bg-ousi-field text-sm text-ousi-field-foreground shadow-ousi-field',
  'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
  'transition-[background-color,border-color,box-shadow] duration-150',
  'hover:not-focus-within:bg-ousi-field-hover',
  'focus-within:ring-2 focus-within:ring-ousi-focus focus-within:bg-ousi-field-focus',
  'data-[disabled=true]:opacity-[--ousi-disabled-opacity] data-[disabled=true]:pointer-events-none',
  'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
].join(' ')

/** Calendar icon button inside the trigger. */
export const datePickerIndicatorTheme = [
  'inline-flex items-center justify-center shrink-0',
  'text-ousi-field-placeholder px-2',
  'cursor-pointer outline-none',
  'hover:text-ousi-foreground transition-colors duration-150',
].join(' ')

/** Floating popover that holds the calendar. */
export const datePickerPopoverTheme = [
  'bg-ousi-overlay shadow-ousi-overlay',
  'overflow-hidden',
].join(' ')

/** Label above the field. */
export const datePickerLabelTheme = cva(
  'text-sm font-medium text-ousi-foreground',
  {
    variants: {
      required: {
        true: 'after:ml-0.5 after:text-ousi-danger after:content-["*"]',
      },
      disabled: {
        true: 'opacity-[--ousi-disabled-opacity] pointer-events-none',
      },
      invalid: {
        true: 'text-ousi-danger',
      },
    },
  },
)

/** Description text. */
export const datePickerDescriptionTheme = 'text-xs text-ousi-muted'

/** Error message text. */
export const datePickerErrorTheme = 'text-xs text-ousi-danger'
