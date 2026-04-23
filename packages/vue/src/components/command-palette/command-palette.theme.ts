import { cva } from 'class-variance-authority'

export const commandPaletteOverlayTheme = 'fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm'

export const commandPaletteTheme = cva(
  'w-full max-w-lg rounded-ousi-2xl border border-ousi-border bg-ousi-surface overflow-hidden',
  {
    variants: {
      shadow: {
        lg: 'shadow-ousi-lg',
        xl: 'shadow-ousi-xl',
        '2xl': 'shadow-ousi-2xl',
      },
    },
    defaultVariants: {
      shadow: 'xl',
    },
  },
)

export const commandPaletteInputTheme = 'w-full px-4 py-3 text-base bg-transparent border-b border-ousi-border outline-none text-ousi-foreground placeholder:text-ousi-muted'
export const commandPaletteListTheme = 'max-h-72 overflow-y-auto p-2'
export const commandPaletteGroupTheme = 'px-2 py-1.5 text-xs font-semibold text-ousi-muted uppercase tracking-wider'
export const commandPaletteItemTheme = 'flex items-center gap-3 px-3 py-2 rounded-ousi-lg text-sm text-ousi-foreground cursor-pointer transition-colors'
export const commandPaletteShortcutTheme = 'ml-auto flex gap-1'
export const commandPaletteKbdTheme = 'px-1.5 py-0.5 rounded-ousi-md bg-ousi-default text-xs text-ousi-muted font-mono'
