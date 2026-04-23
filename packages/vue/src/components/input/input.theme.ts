import { cva } from 'class-variance-authority'

export const inputGroupTheme = cva(
  [
    'input-group',
    'flex w-full min-h-9 items-center overflow-hidden rounded-ousi-field',
    'border bg-ousi-field text-sm text-ousi-field-foreground outline-none',
    'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
    'motion-reduce:transition-none',
    // Hover (only when not focused)
    'hover:not-focus-within:bg-ousi-field-hover',
    // Focus within
    'focus-within:ring-2 focus-within:ring-ousi-focus',
    'focus-within:bg-ousi-field-focus',
    // Invalid
    'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
    'data-[invalid=true]:bg-ousi-field-focus',
    // Disabled
    'data-[disabled=true]:opacity-[--ousi-disabled-opacity]',
    'data-[disabled=true]:cursor-[--ousi-cursor-disabled]',
    'data-[disabled=true]:pointer-events-none',
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
          'ease-[ease]',
        ],
      },
    },
    compoundVariants: [
      { variant: 'secondary', shadow: 'xs', class: 'shadow-none' },
    ],
    defaultVariants: {
      variant: 'primary',
      shadow: 'xs',
      animated: false,
    },
  },
)

export const inputInnerTheme = cva(
  [
    'input-group__input',
    'flex-1 rounded-none border-0 bg-transparent',
    'px-3 py-2 text-base sm:text-sm',
    'shadow-none outline-none',
    'placeholder:text-ousi-field-placeholder',
    'focus:outline-none focus-visible:outline-none',
    // Neutralize browser autofill styles
    'autofill:shadow-[inset_0_0_0_1000px_var(--ousi-field-background)]',
    'autofill:[-webkit-text-fill-color:var(--ousi-field-foreground)]',
    'autofill:[caret-color:var(--ousi-field-foreground)]',
  ],
  {
    variants: {
      size: {
        sm: 'py-1 text-sm',
        md: 'py-2 text-sm',
        lg: 'py-2.5 text-base',
      },
      hasStart: {
        true: 'pl-1',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export const labelTheme = cva(
  ['label', 'text-sm font-medium text-ousi-foreground'],
  {
    variants: {
      required: {
        true: 'after:ml-0.5 after:text-ousi-danger after:content-["*"]',
      },
      disabled: {
        true: 'opacity-[--ousi-disabled-opacity] cursor-[--ousi-cursor-disabled] pointer-events-none',
      },
      invalid: {
        true: 'text-ousi-danger',
      },
    },
  },
)
