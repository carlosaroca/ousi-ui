import { cva } from 'class-variance-authority'

export const separatorTheme = cva(
  'shrink-0',
  {
    variants: {
      orientation: {
        horizontal: 'h-px w-full',
        vertical: 'h-auto min-h-2 w-px self-stretch',
      },
      variant: {
        default: 'bg-ousi-separator',
        secondary: 'bg-ousi-separator-secondary',
        tertiary: 'bg-ousi-separator-tertiary',
      },
    },
    defaultVariants: { orientation: 'horizontal', variant: 'default' },
  },
)

export const separatorContainerTheme = cva(
  'flex items-center gap-3',
  {
    variants: {
      orientation: {
        horizontal: 'w-full flex-row',
        vertical: 'h-full flex-col justify-center',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
)

export const separatorLineTheme = cva(
  'shrink-0 grow',
  {
    variants: {
      orientation: {
        horizontal: 'h-px',
        vertical: 'w-px',
      },
      variant: {
        default: 'bg-ousi-separator',
        secondary: 'bg-ousi-separator-secondary',
        tertiary: 'bg-ousi-separator-tertiary',
      },
    },
    defaultVariants: { orientation: 'horizontal', variant: 'default' },
  },
)

export const separatorContentTheme = [
  'inline-flex items-center justify-center',
  'text-center whitespace-nowrap',
  'text-xs text-ousi-muted',
].join(' ')
