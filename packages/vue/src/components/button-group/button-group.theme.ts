import { cva } from 'class-variance-authority'

// Static theme — complex child selectors handled in component CSS
export const buttonGroupBaseTheme = cva(
  'inline-flex items-center justify-center gap-0',
  {
    variants: {
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
    },
    defaultVariants: {
      shadow: 'none',
    },
  },
)
