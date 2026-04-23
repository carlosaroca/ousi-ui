import { cva } from 'class-variance-authority'

export const bentoGridTheme = 'grid auto-rows-[minmax(180px,1fr)]'

export const bentoGridItemTheme = cva(
  'rounded-ousi-2xl border border-ousi-border bg-ousi-surface p-6 overflow-hidden transition-shadow hover:shadow-lg',
  {
    variants: {
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
        xl: 'shadow-ousi-xl',
      },
    },
    defaultVariants: {
      shadow: 'none',
    },
  },
)
