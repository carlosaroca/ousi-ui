import { cva } from 'class-variance-authority'

/** Menu surface — no border, just shadow on overlay bg (matches Popover styling). */
export const contextMenuTheme = cva(
  [
    'min-w-[180px] max-w-[280px] rounded-ousi-xl p-1 z-50',
    'bg-ousi-overlay text-ousi-overlay-foreground',
    'outline-none',
  ],
  {
    variants: {
      shadow: {
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
        xl: 'shadow-ousi-xl',
      },
    },
    defaultVariants: { shadow: 'lg' },
  },
)

export const contextMenuItemTheme = [
  'flex items-center gap-2 rounded-ousi-lg px-3 py-1.5 text-sm text-ousi-foreground',
  'cursor-pointer transition-colors outline-none select-none',
].join(' ')

/** Section heading — uppercase muted, non-interactive. */
export const contextMenuHeadingTheme = [
  'px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider font-semibold text-ousi-muted',
  'select-none cursor-default',
].join(' ')

export const contextMenuSeparatorTheme = 'my-1 mx-1 h-px bg-ousi-border/40'
export const contextMenuShortcutTheme = 'ml-auto text-xs text-ousi-muted tracking-wide'
export const contextMenuChevronTheme = 'ml-auto size-3.5 text-ousi-muted shrink-0'
export const contextMenuIconTheme = 'size-4 text-ousi-muted shrink-0'
