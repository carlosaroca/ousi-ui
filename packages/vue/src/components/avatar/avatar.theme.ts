import { cva } from 'class-variance-authority'

export const avatarTheme = cva(
  'relative inline-flex items-center justify-center overflow-hidden bg-ousi-default text-ousi-default-foreground font-medium shrink-0 select-none',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-lg',
        xl: 'h-20 w-20 text-xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-ousi-lg',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  },
)
