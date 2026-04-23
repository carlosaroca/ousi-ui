import { cva } from 'class-variance-authority'

export const collapsibleTheme = cva('w-full', {
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
})

export const collapsibleContentTheme = 'overflow-hidden'
