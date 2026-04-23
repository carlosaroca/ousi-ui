import { cva } from 'class-variance-authority'

export const toastRegionTheme = cva(
  [
    'pointer-events-none fixed z-[100] outline-none',
    'w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[460px]',
  ],
  {
    variants: {
      placement: {
        'bottom': 'bottom-4 left-1/2 -translate-x-1/2',
        'bottom-start': 'bottom-4 left-4',
        'bottom-end': 'bottom-4 right-4',
        'top': 'top-4 left-1/2 -translate-x-1/2',
        'top-start': 'top-4 left-4',
        'top-end': 'top-4 right-4',
      },
    },
    defaultVariants: { placement: 'bottom-end' },
  },
)

export const toastItemTheme = cva(
  [
    'pointer-events-auto relative',
    'flex flex-row items-start justify-start gap-1.5',
    'rounded-ousi-3xl bg-ousi-surface',
    'px-4 py-3',
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
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
        xl: 'shadow-ousi-xl',
      },
    },
    defaultVariants: { variant: 'default', shadow: 'lg' },
  },
)

export const toastIndicatorTheme = cva(
  'flex shrink-0 items-center justify-center p-1 select-none',
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

export const toastTitleTheme = cva(
  'text-sm leading-5 font-medium',
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
