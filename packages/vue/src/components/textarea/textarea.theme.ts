import { cva } from 'class-variance-authority'

// Reuse label theme from Input
export { labelTheme as textareaLabelTheme } from '../input/input.theme'

export const textareaWrapperTheme = 'flex w-full flex-col gap-1.5'

export const textareaFieldTheme = cva(
  [
    'rounded-ousi-field border bg-ousi-field w-full',
    'px-3 py-2 text-sm text-ousi-field-foreground outline-none',
    'placeholder:text-ousi-field-placeholder',
    'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
    'motion-reduce:transition-none',
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
          'border-transparent bg-ousi-surface-secondary',
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
          'focus:scale-[0.98]',
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
      resize: 'vertical',
      shadow: 'xs',
      animated: false,
    },
  },
)

export const textareaDescriptionTheme = 'text-xs text-ousi-muted'

export const textareaErrorTheme = 'text-xs text-ousi-danger'
