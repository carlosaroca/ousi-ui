export interface CommandItem {
  label: string
  key: string
  icon?: string
  shortcut?: string
  group?: string
  disabled?: boolean
}

export type CommandPaletteShadow = 'lg' | 'xl' | '2xl'

export interface CommandPaletteProps {
  items: CommandItem[]
  modelValue?: boolean
  placeholder?: string
  emptyText?: string
  /** Elevation shadow. Defaults to 'xl'. */
  shadow?: CommandPaletteShadow
  class?: string
}

export interface CommandPaletteEmits {
  'update:modelValue': [value: boolean]
  'select': [key: string, item: CommandItem]
}
