import { cva } from 'class-variance-authority'

/** Outer wrapper — stacks label, trigger, description/error vertically. */
export const datePickerWrapperTheme = 'flex w-full flex-col gap-1'

/** Trigger row — unified field container for segments + icon. Owns ALL field chrome. */
export const datePickerTriggerTheme = cva(
  [
    'inline-flex w-full items-center min-h-9 rounded-ousi-field px-3',
    'border bg-ousi-field text-ousi-field-foreground',
    'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
    'motion-reduce:transition-none',
    'hover:not-focus-within:bg-ousi-field-hover',
    'focus-within:ring-2 focus-within:ring-ousi-focus focus-within:bg-ousi-field-focus',
    'data-[disabled=true]:opacity-[--ousi-disabled-opacity] data-[disabled=true]:pointer-events-none',
    'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
  ],
  {
    variants: {
      variant: {
        primary: '',
        secondary: [
          'border-transparent bg-ousi-surface-secondary',
          'hover:not-focus-within:bg-ousi-surface-tertiary',
          'focus-within:bg-ousi-surface-secondary',
        ],
      },
      size: {
        sm: 'py-1 text-sm',
        md: 'py-2 text-sm',
        lg: 'py-2.5 text-base',
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
      animated: {
        true: [
          'transition-all duration-[400ms]',
          'ease-[cubic-bezier(0.33,1,0.68,1)]',
          'focus-within:scale-[0.98]',
        ],
        false: [
          'transition-[background-color,border-color,box-shadow] duration-150',
        ],
      },
    },
    compoundVariants: [
      { variant: 'secondary', shadow: 'xs', class: 'shadow-none' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shadow: 'xs',
      animated: false,
    },
  },
)

/** Calendar icon button inside the trigger. */
export const datePickerIndicatorTheme = [
  'inline-flex items-center justify-center shrink-0',
  'text-ousi-field-placeholder px-2',
  'cursor-pointer outline-none',
  'hover:text-ousi-foreground transition-colors duration-150',
].join(' ')

/** Floating popover that holds the calendar. */
export const datePickerPopoverTheme = [
  'bg-ousi-overlay shadow-ousi-xl',
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
