import { cva } from 'class-variance-authority'

export const dateFieldWrapperTheme = cva(
  [
    'inline-flex min-h-9 items-center gap-0 overflow-hidden rounded-ousi-field',
    'border bg-ousi-field text-ousi-field-foreground outline-none px-3',
    'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
    'motion-reduce:transition-none',
    'hover:not-focus-within:bg-ousi-field-hover',
    'focus-within:ring-2 focus-within:ring-ousi-focus focus-within:bg-ousi-field-focus',
    'data-[disabled=true]:opacity-[--ousi-disabled-opacity] data-[disabled=true]:pointer-events-none',
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

export function dateFieldSegmentTheme(focused: boolean): string {
  const base = 'tabular-nums outline-none rounded-sm px-0.5 select-none caret-transparent'
  if (focused) return `${base} bg-ousi-accent text-ousi-accent-foreground`
  return `${base} text-ousi-field-foreground`
}

export const dateFieldLiteralTheme = 'text-ousi-muted select-none px-px'

export const dateFieldPlaceholderTheme = 'text-ousi-field-placeholder'
