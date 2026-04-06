import { cva } from 'class-variance-authority'

/** Root container. */
export const timelineTheme = cva(
  'relative',
  {
    variants: {
      layout: {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row overflow-x-auto',
      },
    },
    defaultVariants: { layout: 'vertical' },
  },
)

/** Each timeline entry row/column. */
export const timelineEntryTheme = cva(
  'relative',
  {
    variants: {
      layout: {
        vertical: 'flex',
        horizontal: 'flex flex-col items-center',
      },
    },
    defaultVariants: { layout: 'vertical' },
  },
)

/** The separator column — contains the marker dot + connector line. */
export const timelineSeparatorTheme = cva(
  'flex items-center justify-center shrink-0',
  {
    variants: {
      layout: {
        vertical: 'flex-col w-8',
        horizontal: 'flex-row h-8',
      },
    },
    defaultVariants: { layout: 'vertical' },
  },
)

/** Connector line between markers. */
export const timelineConnectorTheme = cva(
  'bg-ousi-border',
  {
    variants: {
      layout: {
        vertical: 'w-px flex-1',
        horizontal: 'h-px flex-1',
      },
    },
    defaultVariants: { layout: 'vertical' },
  },
)

/** Marker dot. */
export const timelineMarkerTheme = cva(
  'relative z-10 flex items-center justify-center rounded-full shrink-0 border-2 border-ousi-background',
  {
    variants: {
      color: {
        accent: 'bg-ousi-accent',
        success: 'bg-ousi-success',
        warning: 'bg-ousi-warning',
        danger: 'bg-ousi-danger',
        default: 'bg-ousi-default-foreground',
      },
      hasIcon: {
        true: 'size-8',
        false: 'size-3',
      },
    },
    defaultVariants: { color: 'accent', hasIcon: false },
  },
)

/** Content panel. */
export const timelineContentTheme = cva(
  'py-2 text-sm text-ousi-foreground',
  {
    variants: {
      layout: {
        vertical: 'flex-1 px-3',
        horizontal: 'px-2 text-center min-w-[120px]',
      },
    },
    defaultVariants: { layout: 'vertical' },
  },
)

/** Opposite panel (for alternate mode). */
export const timelineOppositeTheme = cva(
  'py-2 text-sm text-ousi-muted',
  {
    variants: {
      layout: {
        vertical: 'flex-1 px-3',
        horizontal: 'px-2 text-center min-w-[120px]',
      },
    },
    defaultVariants: { layout: 'vertical' },
  },
)
