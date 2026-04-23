import { cva } from 'class-variance-authority'

/** Root container — outer frame. Primary = gray bg, secondary = white bg (inverted). */
export const codeBlockTheme = cva(
  'relative w-full overflow-clip rounded-ousi-2xl px-1 pb-1',
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface-secondary',
        secondary: 'bg-ousi-surface border border-ousi-border/60',
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      shadow: 'none',
    },
  },
)

/** Header row — filename on the left, copy button on the right. Background follows the outer frame. */
export const codeBlockHeaderTheme = cva(
  'flex items-center justify-between gap-2 px-4 py-2.5',
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface-secondary',
        secondary: 'bg-ousi-surface',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

/** Filename text inside the header. */
export const codeBlockFilenameTheme = 'text-xs font-medium text-ousi-muted font-mono truncate min-w-0'

/** Body wrapper — the inner card, colored opposite to the root. */
export const codeBlockBodyWrapperTheme = cva(
  'relative rounded-ousi-2xl overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface',
        secondary: 'bg-ousi-surface-secondary',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

/** Code scroll area. */
export const codeBlockBodyTheme = 'overflow-x-auto font-mono text-[13px] leading-6'

/** Line number cell. */
export const codeBlockLineNumberTheme = [
  'w-8 pr-3 text-right text-ousi-muted/40 select-none',
  'align-top shrink-0 pl-4 tabular-nums',
].join(' ')

/** Code cell. */
export const codeBlockCodeTheme = 'text-ousi-foreground whitespace-pre pr-4'

/** Copy button — sits in the header row. */
export const codeBlockCopyTheme = [
  'size-7 flex items-center justify-center rounded-ousi-lg shrink-0',
  'text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default/50',
  'transition-colors',
].join(' ')

/** Expand/collapse toggle button. */
export const codeBlockToggleTheme = [
  'flex items-center gap-1.5 h-6 rounded-ousi-xl',
  'bg-ousi-surface border border-ousi-border px-3',
  'text-[11px] font-medium text-ousi-muted hover:text-ousi-foreground',
  'shadow-sm transition-colors',
].join(' ')

/** Fade overlay when collapsed (deprecated — collapse now uses mask-image). Kept for backwards compatibility. */
export const codeBlockFadeTheme = 'absolute bottom-8 left-0 right-0 h-10 pointer-events-none bg-gradient-to-b from-transparent to-ousi-background'
