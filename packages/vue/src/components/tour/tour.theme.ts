import { cva } from 'class-variance-authority'

// The card follows the popover's tokens.
export const tourCardTheme = cva(
  [
    'flex w-80 max-w-[calc(100vw-1.5rem)] flex-col gap-3 p-4 text-sm outline-none',
    'max-h-[calc(100dvh-1.5rem)] overflow-y-auto',
    'rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground',
    'border-solid border-[length:var(--ousi-border-width)] border-ousi-border/50',
  ],
  {
    variants: {
      shadow: { md: 'shadow-ousi-md', lg: 'shadow-ousi-lg', xl: 'shadow-ousi-xl', '2xl': 'shadow-ousi-2xl' },
    },
    defaultVariants: { shadow: 'xl' },
  },
)

/** The cut-out: its own shadow, as large as the screen, is the scrim around it. */
export const tourSpotlightTheme =
  'pointer-events-none fixed [--tour-radius:var(--ousi-radius-xl)] rounded-(--tour-radius) shadow-[0_0_0_200vmax_var(--ousi-backdrop)] outline-solid outline-[length:var(--ousi-border-width)] outline-ousi-border'
