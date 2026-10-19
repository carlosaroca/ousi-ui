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

/** Clipped only while it animates or is closed (inline style), so focus rings show when open. */
export const collapsibleContentTheme = ''
