import { cva } from 'class-variance-authority'

/** Outer wrapper — stacks label, trigger, description/error vertically. */
export const dateRangePickerWrapperTheme = cva(
  'inline-flex flex-col gap-1',
  {
    variants: {
      fullWidth: { true: 'w-full', false: 'w-fit' },
    },
    defaultVariants: { fullWidth: false },
  },
)

/** Trigger row — unified field for start segments + separator + end segments + icon. */
export const dateRangePickerTriggerTheme = [
  'inline-flex w-full items-center min-h-9 rounded-ousi-field px-3 py-2',
  'border bg-ousi-field text-sm text-ousi-field-foreground shadow-ousi-field',
  'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
  'transition-[background-color,border-color,box-shadow] duration-150',
  'hover:not-focus-within:bg-ousi-field-hover',
  'focus-within:ring-2 focus-within:ring-ousi-focus focus-within:bg-ousi-field-focus',
  'data-[disabled=true]:opacity-[--ousi-disabled-opacity] data-[disabled=true]:pointer-events-none',
  'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
].join(' ')

/** Arrow separator between start and end segments. */
export const dateRangePickerSeparatorTheme = 'px-1.5 text-ousi-field-placeholder select-none shrink-0'

/** Calendar icon button inside the trigger. */
export const dateRangePickerIndicatorTheme = [
  'inline-flex items-center justify-center shrink-0',
  'text-ousi-field-placeholder px-2',
  'cursor-pointer outline-none',
  'hover:text-ousi-foreground transition-colors duration-150',
].join(' ')

/** Floating popover that holds the range calendar. */
export const dateRangePickerPopoverTheme = [
  'bg-ousi-overlay shadow-ousi-overlay',
  'overflow-hidden',
].join(' ')

/** Label above the field. */
export const dateRangePickerLabelTheme = cva(
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
export const dateRangePickerDescriptionTheme = 'text-xs text-ousi-muted'

/** Error message text. */
export const dateRangePickerErrorTheme = 'text-xs text-ousi-danger'
