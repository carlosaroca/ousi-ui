import { cva } from 'class-variance-authority'

export const contextMenuTheme = cva(
  'min-w-[180px] rounded-ousi-xl border border-ousi-border bg-ousi-surface p-1 z-50',
  {
    variants: {
      shadow: {
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
        xl: 'shadow-ousi-xl',
      },
    },
    defaultVariants: {
      shadow: 'lg',
    },
  },
)

export const contextMenuItemTheme = 'flex items-center gap-2 rounded-ousi-lg px-3 py-1.5 text-sm text-ousi-foreground cursor-pointer transition-colors hover:bg-ousi-default outline-none focus-visible:bg-ousi-default'
export const contextMenuSeparatorTheme = 'my-1 h-px bg-ousi-border/50'
export const contextMenuShortcutTheme = 'ml-auto text-xs text-ousi-muted'
