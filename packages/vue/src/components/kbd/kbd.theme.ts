import { cva } from 'class-variance-authority'

export const kbdTheme = cva(
  [
    'inline-flex h-6 items-center space-x-0.5 rtl:space-x-reverse',
    'rounded-ousi-lg px-2 text-center',
    'font-sans text-sm font-medium whitespace-nowrap',
    'text-ousi-muted',
  ],
  {
    variants: {
      variant: {
        default: 'bg-ousi-default',
        light: 'bg-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export const kbdAbbrTheme = 'flex items-center justify-center no-underline'

export const kbdContentTheme = 'flex items-center justify-center'
