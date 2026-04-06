import { cva } from 'class-variance-authority'

export const spinnerTheme = cva(
  'pointer-events-none origin-center',
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-6',
        lg: 'size-8',
        xl: 'size-10',
      },
      color: {
        current: 'text-current',
        accent: 'text-ousi-accent',
        danger: 'text-ousi-danger',
        success: 'text-ousi-success',
        warning: 'text-ousi-warning',
      },
    },
    defaultVariants: { size: 'md', color: 'current' },
  },
)
