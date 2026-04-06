import CommandPalette from './CommandPalette.vue'

const OCommandPalette = CommandPalette

export { OCommandPalette }
export type { CommandItem, CommandPaletteProps, CommandPaletteEmits } from './command-palette.types'
export {
  commandPaletteOverlayTheme,
  commandPaletteTheme,
  commandPaletteInputTheme,
  commandPaletteListTheme,
  commandPaletteGroupTheme,
  commandPaletteItemTheme,
  commandPaletteShortcutTheme,
  commandPaletteKbdTheme,
} from './command-palette.theme'
