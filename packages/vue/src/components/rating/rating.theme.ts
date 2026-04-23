import { cva } from 'class-variance-authority'

export const ratingTheme = cva('inline-flex items-center gap-0.5', {
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
})

export const ratingStarTheme = 'cursor-pointer transition-transform duration-150 hover:scale-110 focus:outline-none'
