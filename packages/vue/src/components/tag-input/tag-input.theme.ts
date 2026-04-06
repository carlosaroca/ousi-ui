import { cva } from 'class-variance-authority'

export const tagInputWrapperTheme = cva(
  'flex flex-col gap-1.5',
  {
    variants: {
      fullWidth: { true: 'w-full', false: 'w-fit' },
    },
    defaultVariants: { fullWidth: false },
  },
)

export const tagInputGroupTheme = cva(
  [
    'flex flex-wrap items-center gap-1.5',
    'rounded-ousi-field border bg-ousi-field text-sm text-ousi-field-foreground shadow-ousi-field outline-none',
    'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
    'transition-[background-color,border-color,box-shadow] duration-150',
    'hover:not-focus-within:bg-ousi-field-hover',
    'focus-within:ring-2 focus-within:ring-ousi-focus focus-within:bg-ousi-field-focus',
    'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
    'data-[disabled=true]:opacity-[--ousi-disabled-opacity] data-[disabled=true]:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: '',
        secondary: [
          'shadow-none border-transparent bg-ousi-surface-secondary',
          'hover:not-focus-within:bg-ousi-surface-tertiary',
          'focus-within:bg-ousi-surface-secondary',
        ],
      },
      size: {
        sm: 'min-h-8 px-2 py-1',
        md: 'min-h-9 px-2.5 py-1.5',
        lg: 'min-h-10 px-3 py-2',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export const tagInputInputTheme = cva(
  'flex-1 min-w-[80px] bg-transparent outline-none text-ousi-foreground placeholder:text-ousi-muted',
  {
    variants: {
      size: {
        sm: 'text-xs py-0.5',
        md: 'text-sm py-0.5',
        lg: 'text-base py-0.5',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const tagInputLabelTheme = cva(
  'text-sm font-medium text-ousi-foreground w-fit',
  {
    variants: {
      required: { true: 'after:ml-0.5 after:text-ousi-danger after:content-["*"]' },
      disabled: { true: 'opacity-[--ousi-disabled-opacity]' },
      invalid: { true: 'text-ousi-danger' },
    },
  },
)
