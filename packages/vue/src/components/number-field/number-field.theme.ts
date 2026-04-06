import { cva } from 'class-variance-authority'

export const numberFieldWrapperTheme = cva(
  'flex flex-col gap-1.5',
  {
    variants: {
      fullWidth: { true: 'w-full', false: 'w-fit' },
    },
    defaultVariants: { fullWidth: false },
  },
)

export const numberFieldGroupTheme = cva(
  [
    'grid items-center overflow-hidden',
    'rounded-ousi-field border bg-ousi-field text-sm text-ousi-field-foreground shadow-ousi-field',
    'outline-none',
    'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
    'transition-[background-color,border-color,box-shadow] duration-150',
    'motion-reduce:transition-none',
    'hover:not-focus-within:bg-ousi-field-hover',
    'focus-within:ring-2 focus-within:ring-ousi-focus focus-within:bg-ousi-field-focus',
    'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
    'data-[invalid=true]:bg-ousi-field-focus',
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
        sm: 'h-8',
        md: 'h-9',
        lg: 'h-10',
      },
      showButtons: {
        true: '[grid-template-columns:40px_1fr_40px]',
        false: '[grid-template-columns:1fr]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md', showButtons: true },
  },
)

export const numberFieldInputTheme = [
  'min-w-0 rounded-none border-0 bg-transparent',
  'px-3 py-2 text-base tabular-nums shadow-none outline-none',
  'text-center text-ousi-field-foreground placeholder:text-ousi-field-placeholder',
  'sm:text-sm',
].join(' ')

const buttonBase = [
  'flex h-full w-10 items-center justify-center',
  'rounded-none bg-transparent text-ousi-field-foreground outline-none',
  'transition-[background-color] duration-150',
  'motion-reduce:transition-none',
  'cursor-pointer',
  'active:bg-ousi-field-foreground/10 active:scale-[0.97]',
  'disabled:opacity-[--ousi-disabled-opacity] disabled:pointer-events-none',
].join(' ')

export const numberFieldDecrementTheme = `${buttonBase} border-r border-r-ousi-field-placeholder/15`

export const numberFieldIncrementTheme = `${buttonBase} border-l border-l-ousi-field-placeholder/15`

export const numberFieldLabelTheme = cva(
  'text-sm font-medium text-ousi-foreground w-fit',
  {
    variants: {
      required: { true: 'after:ml-0.5 after:text-ousi-danger after:content-["*"]' },
      disabled: { true: 'opacity-[--ousi-disabled-opacity]' },
      invalid: { true: 'text-ousi-danger' },
    },
  },
)

export const numberFieldDescriptionTheme = 'text-xs text-ousi-muted'

export const numberFieldErrorTheme = 'text-xs text-ousi-danger'
