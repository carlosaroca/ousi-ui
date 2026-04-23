import { cva } from 'class-variance-authority'

// Static classes only — animation handled via inline styles in the component
export const skeletonBaseTheme = cva(
  'pointer-events-none relative overflow-hidden rounded-ousi-sm',
  {
    variants: {
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
      },
    },
    defaultVariants: {
      shadow: 'none',
    },
  },
)
