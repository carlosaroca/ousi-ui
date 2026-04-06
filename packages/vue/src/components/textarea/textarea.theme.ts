import { cva } from 'class-variance-authority'

// Reuse label theme from Input
export { labelTheme as textareaLabelTheme } from '../input/input.theme'

export const textareaWrapperTheme = cva(
  'flex flex-col gap-1.5',
  {
    variants: {
      fullWidth: { true: 'w-full', false: 'w-fit' },
    },
    defaultVariants: { fullWidth: false },
  },
)

export const textareaFieldTheme = cva(
  [
    'rounded-ousi-field border bg-ousi-field w-full',
    'px-3 py-2 text-sm text-ousi-field-foreground shadow-ousi-field outline-none',
    'placeholder:text-ousi-field-placeholder',
    'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
    'transition-[background-color,border-color,box-shadow] duration-150',
    'ease-[ease] motion-reduce:transition-none',
    // Hover
    'hover:not-focus:bg-ousi-field-hover',
    // Focus
    'focus:ring-2 focus:ring-ousi-focus',
    'focus:bg-ousi-field-focus',
    // Invalid
    'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
    'data-[invalid=true]:bg-ousi-field-focus',
    // Disabled
    'data-[disabled=true]:opacity-50',
    'data-[disabled=true]:pointer-events-none',
    // Autofill
    'autofill:shadow-[inset_0_0_0_1000px_var(--ousi-field-background)]',
    'autofill:[-webkit-text-fill-color:var(--ousi-field-foreground)]',
  ],
  {
    variants: {
      variant: {
        primary: '',
        secondary: [
          'shadow-none border-transparent bg-ousi-surface-secondary',
          'hover:not-focus:bg-ousi-surface-tertiary',
          'focus:bg-ousi-surface-secondary',
        ],
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
    },
    defaultVariants: {
      variant: 'primary',
      resize: 'vertical',
    },
  },
)

export const textareaDescriptionTheme = 'text-xs text-ousi-muted'

export const textareaErrorTheme = 'text-xs text-ousi-danger'
