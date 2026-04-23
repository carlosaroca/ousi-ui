import { cva } from 'class-variance-authority'

export const alertTheme = cva(
  [
    'flex w-full flex-row items-start justify-start gap-4',
    'rounded-ousi-3xl bg-ousi-surface px-4 py-3',
  ],
  {
    variants: {
      variant: {
        default: '',
        accent: '',
        success: '',
        warning: '',
        danger: '',
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      shadow: 'none',
    },
  },
)

export const alertIndicatorTheme = cva(
  'flex items-center justify-center p-1 select-none shrink-0',
  {
    variants: {
      variant: {
        default: 'text-ousi-foreground',
        accent: 'text-ousi-accent',
        success: 'text-ousi-success',
        warning: 'text-ousi-warning',
        danger: 'text-ousi-danger',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export const alertTitleTheme = cva(
  'text-sm leading-6 font-medium',
  {
    variants: {
      variant: {
        default: 'text-ousi-foreground',
        accent: 'text-ousi-accent',
        success: 'text-ousi-success',
        warning: 'text-ousi-warning',
        danger: 'text-ousi-danger',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export const alertDescriptionTheme = 'text-sm text-ousi-muted'

export const alertContentTheme = 'flex h-full grow flex-col items-start'
