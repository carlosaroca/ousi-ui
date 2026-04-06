import { cva } from 'class-variance-authority'

/** Root container. */
export const codeBlockTheme = 'rounded-ousi-xl border border-ousi-border overflow-hidden'

/** Optional header bar with filename. */
export const codeBlockHeaderTheme = [
  'flex items-center justify-between px-4 py-2',
  'border-b border-ousi-border/50 bg-ousi-surface-secondary/50',
  'text-xs text-ousi-muted font-mono',
].join(' ')

/** Code scroll area. */
export const codeBlockBodyTheme = 'overflow-x-auto font-mono text-[13px] leading-6'

/** Line number cell. */
export const codeBlockLineNumberTheme = [
  'w-8 pr-3 text-right text-ousi-muted/40 select-none',
  'align-top shrink-0 pl-4 tabular-nums',
].join(' ')

/** Code cell. */
export const codeBlockCodeTheme = 'text-ousi-foreground whitespace-pre pr-4'

/** Copy button. */
export const codeBlockCopyTheme = [
  'size-7 flex items-center justify-center rounded-ousi-lg',
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

/** Fade overlay when collapsed. */
export const codeBlockFadeTheme = 'absolute bottom-8 left-0 right-0 h-10 pointer-events-none bg-gradient-to-b from-transparent to-ousi-background'
