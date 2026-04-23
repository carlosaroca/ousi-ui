import { cva } from 'class-variance-authority'

export const popoverPanelTheme = cva(
  [
    'rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground text-sm',
    'z-50 outline-none',
  ],
  {
    variants: {
      shadow: {
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
        xl: 'shadow-ousi-xl',
      },
    },
    defaultVariants: {
      shadow: 'lg',
    },
  },
)

export const popoverDialogTheme = 'p-4 outline-none'

export const popoverHeadingTheme = 'font-medium text-ousi-foreground mb-1'

export const popoverTriggerTheme = 'inline-flex'
