import { cva } from 'class-variance-authority'

export const checkboxWrapperTheme = cva(
  [
    'group flex outline-none select-none',
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
      size: {
        sm: 'gap-2',
        md: 'gap-3',
        lg: 'gap-3',
      },
    },
    defaultVariants: { hasDescription: false, size: 'md' },
  },
)

export const checkboxControlShadowTheme = {
  none: 'shadow-none',
  xs: 'shadow-ousi-xs',
  sm: 'shadow-ousi-sm',
} as const

// Pixel dimensions per size — control box + checkmark/indeterminate SVG.
// Consumed by inline styles so the existing `--ousi-checkbox-size` CSS-var escape hatch keeps working.
export const checkboxControlSizeMap = {
  sm: { box: 16, indicator: 10 },
  md: { box: 20, indicator: 12 },
  lg: { box: 24, indicator: 14 },
} as const

export const checkboxContentTheme = 'flex flex-col gap-0'

export const checkboxLabelTheme = cva('font-medium text-ousi-foreground select-none', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'md' },
})

export const checkboxDescriptionTheme = cva('text-ousi-muted select-none', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export const checkboxErrorTheme = 'text-xs text-ousi-danger mt-0.5'
