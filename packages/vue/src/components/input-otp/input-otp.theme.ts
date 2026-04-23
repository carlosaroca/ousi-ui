import { cva } from 'class-variance-authority'

/** Container. */
export const inputOtpTheme = cva(
  'relative flex items-center',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    defaultVariants: { disabled: false },
  },
)

/** Group of slots. */
export const inputOtpGroupTheme = cva(
  'flex items-center',
  {
    variants: {
      size: {
        sm: 'gap-1.5',
        md: 'gap-2',
        lg: 'gap-2.5',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

/** Individual slot — filled/active bg variants are per-variant, not in base. */
export const inputOtpSlotTheme = cva(
  [
    'relative flex items-center justify-center',
    'font-semibold outline-none',
    'motion-reduce:transition-none',
    'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
    'data-[disabled=true]:opacity-[--ousi-disabled-opacity] data-[disabled=true]:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'border bg-ousi-field text-ousi-field-foreground',
          'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
          'hover:bg-ousi-field-hover',
          'data-[active=true]:z-10 data-[active=true]:bg-ousi-field-focus',
          'data-[active=true]:ring-2 data-[active=true]:ring-ousi-focus',
          'data-[filled=true]:bg-ousi-field-focus',
        ],
        secondary: [
          'border-0 bg-ousi-default text-ousi-field-foreground',
          'hover:bg-ousi-default-hover',
          'data-[active=true]:z-10 data-[active=true]:bg-ousi-default',
          'data-[active=true]:ring-2 data-[active=true]:ring-ousi-focus',
          'data-[filled=true]:bg-ousi-default',
        ],
      },
      size: {
        sm: 'w-8 h-9 text-base rounded-ousi-xl',
        md: 'w-10 h-12 text-xl rounded-ousi-2xl',
        lg: 'w-12 h-14 text-2xl rounded-ousi-2xl',
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
          'data-[active=true]:scale-[0.98]',
        ],
        false: [
          'transition-[background-color,border-color,box-shadow] duration-150',
        ],
      },
    },
    compoundVariants: [
      { variant: 'secondary', shadow: 'xs', class: 'shadow-none' },
    ],
    defaultVariants: { variant: 'primary', size: 'md', shadow: 'xs', animated: false },
  },
)

/** Separator between groups. */
export const inputOtpSeparatorTheme = 'shrink-0 rounded-sm bg-ousi-separator mx-1'

/** Label. */
export const inputOtpLabelTheme = 'text-sm font-medium text-ousi-foreground w-fit mb-1.5'

/** Description. */
export const inputOtpDescriptionTheme = 'text-xs text-ousi-muted mt-1.5'

/** Error. */
export const inputOtpErrorTheme = 'text-xs text-ousi-danger mt-1.5'
