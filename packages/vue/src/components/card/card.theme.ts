import { cva } from 'class-variance-authority'

export const cardTheme = cva(
  [
    'relative flex flex-col gap-3 overflow-hidden p-4',
    'rounded-ousi-4xl shadow-ousi-surface',
  ],
  {
    variants: {
      variant: {
        transparent: 'border-none bg-transparent shadow-none',
        default: 'bg-ousi-surface',
        secondary: 'bg-ousi-surface-secondary',
        tertiary: 'bg-ousi-surface-tertiary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const cardHeaderTheme = 'flex flex-col'

export const cardTitleTheme = 'text-sm leading-6 font-medium text-ousi-foreground'

export const cardDescriptionTheme = 'text-sm leading-5 text-ousi-muted'

export const cardContentTheme = 'flex flex-1 flex-col gap-1'

export const cardFooterTheme = 'flex flex-row items-center'
