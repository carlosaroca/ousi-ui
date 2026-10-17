import { cva } from 'class-variance-authority'

export const chipTheme = cva(
  'inline-flex items-center font-medium whitespace-nowrap transition-colors select-none',
  {
    variants: {
      variant: {
        solid: '',
        outline: '',
        soft: '',
        text: '',
      },
      size: {
        xs: 'h-5 px-1.5 text-[11px] gap-1 rounded-ousi-sm',
        sm: 'h-6 px-2 text-xs gap-1 rounded-ousi-md',
        md: 'h-7 px-2.5 text-[13px] gap-1.5 rounded-ousi-lg',
        lg: 'h-8 px-3 text-sm gap-1.5 rounded-ousi-xl',
      },
      color: {
        accent: '',
        success: '',
        warning: '',
        danger: '',
        default: '',
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
      },
    },
    compoundVariants: [
      // Accent
      { variant: 'solid', color: 'accent', class: 'bg-ousi-accent text-ousi-accent-foreground' },
      { variant: 'outline', color: 'accent', class: 'border border-ousi-accent text-ousi-accent' },
      { variant: 'soft', color: 'accent', class: 'font-semibold bg-ousi-accent-soft text-ousi-accent-soft-strong ring-1 ring-inset ring-ousi-accent/20' },
      { variant: 'text', color: 'accent', class: 'text-ousi-accent' },

      // Success
      { variant: 'solid', color: 'success', class: 'bg-ousi-success text-ousi-success-foreground' },
      { variant: 'outline', color: 'success', class: 'border border-ousi-success text-ousi-success' },
      { variant: 'soft', color: 'success', class: 'font-semibold bg-ousi-success-soft text-ousi-success-soft-strong ring-1 ring-inset ring-ousi-success/20' },
      { variant: 'text', color: 'success', class: 'text-ousi-success' },

      // Warning
      { variant: 'solid', color: 'warning', class: 'bg-ousi-warning text-ousi-warning-foreground' },
      { variant: 'outline', color: 'warning', class: 'border border-ousi-warning text-ousi-warning' },
      { variant: 'soft', color: 'warning', class: 'font-semibold bg-ousi-warning-soft text-ousi-warning-soft-strong ring-1 ring-inset ring-ousi-warning/20' },
      { variant: 'text', color: 'warning', class: 'text-ousi-warning' },

      // Danger
      { variant: 'solid', color: 'danger', class: 'bg-ousi-danger text-ousi-danger-foreground' },
      { variant: 'outline', color: 'danger', class: 'border border-ousi-danger text-ousi-danger' },
      { variant: 'soft', color: 'danger', class: 'font-semibold bg-ousi-danger-soft text-ousi-danger-soft-strong ring-1 ring-inset ring-ousi-danger/20' },
      { variant: 'text', color: 'danger', class: 'text-ousi-danger' },

      // Default
      { variant: 'solid', color: 'default', class: 'bg-ousi-default text-ousi-default-foreground' },
      { variant: 'outline', color: 'default', class: 'border border-ousi-border text-ousi-default-foreground' },
      { variant: 'soft', color: 'default', class: 'font-semibold bg-ousi-default text-ousi-muted ring-1 ring-inset ring-ousi-border' },
      { variant: 'text', color: 'default', class: 'text-ousi-default-foreground' },
    ],
    defaultVariants: {
      variant: 'soft',
      size: 'md',
      color: 'accent',
      shadow: 'none',
    },
  },
)
