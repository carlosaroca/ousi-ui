import { cva } from 'class-variance-authority'

export const meterTheme = cva(
  [
    'grid w-full gap-1',
    '[grid-template-areas:"label_output"_"track_track"]',
    '[grid-template-columns:1fr_auto]',
  ],
  {
    variants: {
      disabled: {
        true: 'opacity-[--ousi-disabled-opacity] pointer-events-none',
        false: '',
      },
    },
    defaultVariants: { disabled: false },
  },
)

export const meterTrackTheme = cva(
  'relative overflow-hidden rounded-full bg-ousi-default [grid-area:track]',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const meterFillTheme = cva(
  [
    'absolute top-0 left-0 h-full rounded-full',
    'transition-[width] duration-300',
    'motion-reduce:transition-none',
  ],
  {
    variants: {
      color: {
        default: 'bg-ousi-default-foreground',
        accent: 'bg-ousi-accent',
        success: 'bg-ousi-success',
        warning: 'bg-ousi-warning',
        danger: 'bg-ousi-danger',
      },
    },
    defaultVariants: { color: 'accent' },
  },
)

export const meterLabelTheme = 'w-fit text-sm font-medium text-ousi-foreground [grid-area:label]'

export const meterOutputTheme = 'text-sm font-medium tabular-nums text-ousi-foreground [grid-area:output]'
