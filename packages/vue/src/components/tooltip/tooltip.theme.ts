import { cva } from 'class-variance-authority'

export const tooltipTheme = cva(
  [
    'max-w-xs rounded-ousi-xl px-2 py-1 text-xs break-all',
    'bg-ousi-overlay text-ousi-overlay-foreground',
    'pointer-events-none',
    'z-50',
  ],
  {
    variants: {
      shadow: {
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
      },
    },
    defaultVariants: {
      shadow: 'md',
    },
  },
)

export const tooltipTriggerTheme = [
  'inline-flex',
].join(' ')
