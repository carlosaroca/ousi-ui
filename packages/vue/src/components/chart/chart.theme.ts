import { cva } from 'class-variance-authority'

export const chartBadgeTheme = cva(
  [
    'absolute pointer-events-none px-2 py-0.5 rounded-full text-xs font-medium',
    'transition-colors duration-100',
  ],
  {
    variants: {
      badgeVariant: {
        default: 'text-white',
        minimal: 'bg-white/10 text-ousi-muted',
      },
    },
    defaultVariants: { badgeVariant: 'default' },
  },
)

export const chartWindowButtonTheme = cva(
  [
    'text-xs font-medium transition-colors duration-100 cursor-pointer',
    'text-ousi-muted hover:text-ousi-foreground',
  ],
  {
    variants: {
      windowStyle: {
        default: 'px-2 py-1 rounded-ousi-sm hover:bg-ousi-default',
        rounded: 'px-2 py-1 rounded-full hover:bg-ousi-default',
        text: 'px-1',
      },
      active: {
        true: 'text-ousi-foreground bg-ousi-default',
        false: '',
      },
    },
    defaultVariants: { windowStyle: 'default', active: false },
  },
)
