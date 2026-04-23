import { cva } from 'class-variance-authority'

export const checkboxWrapperTheme = cva(
  [
    'group flex gap-3 outline-none select-none',
    'cursor-pointer',
    'transition-opacity duration-150',
    'data-[disabled=true]:opacity-50',
    'data-[disabled=true]:pointer-events-none',
  ],
  {
    variants: {
      hasDescription: {
        true: 'items-start',
        false: 'items-center',
      },
    },
    defaultVariants: { hasDescription: false },
  },
)

export const checkboxControlShadowTheme = {
  none: 'shadow-none',
  xs: 'shadow-ousi-xs',
  sm: 'shadow-ousi-sm',
} as const

export const checkboxContentTheme = 'flex flex-col gap-0'

export const checkboxLabelTheme = 'text-sm font-medium text-ousi-foreground select-none'

export const checkboxDescriptionTheme = 'text-sm text-ousi-muted select-none'

export const checkboxErrorTheme = 'text-xs text-ousi-danger mt-0.5'
