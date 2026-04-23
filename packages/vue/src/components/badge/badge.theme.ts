import { cva } from 'class-variance-authority'

export const badgeTheme = cva(
  [
    'inline-flex items-center justify-center font-medium leading-none',
    'border-2 border-ousi-background',
    'select-none whitespace-nowrap',
    'transition-[opacity,transform] duration-150',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-4 min-w-4 px-1 text-[10px] rounded-full',
        md: 'min-h-5 min-w-5 px-1.5 text-xs rounded-full',
        lg: 'min-h-6 min-w-6 px-2 text-sm rounded-full',
      },
      dot: {
        true: '',
        false: '',
      },
      color: {
        default: '',
        accent: '',
        success: '',
        warning: '',
        danger: '',
      },
      variant: {
        primary: '',
        secondary: 'bg-ousi-default',
        soft: '',
      },
      invisible: {
        true: 'opacity-0 pointer-events-none',
        false: '',
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
      },
    },
    compoundVariants: [
      // Dot sizes override
      { dot: true, size: 'sm', class: 'min-h-2 min-w-2 p-0' },
      { dot: true, size: 'md', class: 'min-h-2.5 min-w-2.5 p-0' },
      { dot: true, size: 'lg', class: 'min-h-3 min-w-3 p-0' },

      // Primary + colors
      { variant: 'primary', color: 'accent', class: 'bg-ousi-accent text-ousi-accent-foreground' },
      { variant: 'primary', color: 'success', class: 'bg-ousi-success text-ousi-success-foreground' },
      { variant: 'primary', color: 'warning', class: 'bg-ousi-warning text-ousi-warning-foreground' },
      { variant: 'primary', color: 'danger', class: 'bg-ousi-danger text-ousi-danger-foreground' },
      { variant: 'primary', color: 'default', class: 'bg-ousi-default text-ousi-default-foreground' },

      // Soft + colors
      { variant: 'soft', color: 'accent', class: 'bg-ousi-accent-soft text-ousi-accent-soft-foreground' },
      { variant: 'soft', color: 'success', class: 'bg-ousi-success-soft text-ousi-success-soft-foreground' },
      { variant: 'soft', color: 'warning', class: 'bg-ousi-warning-soft text-ousi-warning-soft-foreground' },
      { variant: 'soft', color: 'danger', class: 'bg-ousi-danger-soft text-ousi-danger-soft-foreground' },
      { variant: 'soft', color: 'default', class: 'bg-ousi-default text-ousi-default-foreground' },

      // Secondary — bg-default, colored text
      { variant: 'secondary', color: 'accent', class: 'text-ousi-accent' },
      { variant: 'secondary', color: 'success', class: 'text-ousi-success' },
      { variant: 'secondary', color: 'warning', class: 'text-ousi-warning' },
      { variant: 'secondary', color: 'danger', class: 'text-ousi-danger' },
      { variant: 'secondary', color: 'default', class: 'text-ousi-default-foreground' },
    ],
    defaultVariants: {
      size: 'md',
      dot: false,
      color: 'danger',
      variant: 'primary',
      invisible: false,
      shadow: 'none',
    },
  },
)

export const badgePlacementTheme: Record<string, string> = {
  'top-right': 'absolute top-0 right-0 translate-x-1/4 -translate-y-1/4',
  'top-left': 'absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4',
  'bottom-right': 'absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4',
  'bottom-left': 'absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
}
