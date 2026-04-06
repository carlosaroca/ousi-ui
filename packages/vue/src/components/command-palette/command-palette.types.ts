export interface CommandItem {
  label: string
  key: string
  icon?: string
  shortcut?: string
  group?: string
  disabled?: boolean
}

export interface CommandPaletteProps {
  items: CommandItem[]
  modelValue?: boolean
  placeholder?: string
  emptyText?: string
  class?: string
}

export interface CommandPaletteEmits {
  'update:modelValue': [value: boolean]
  'select': [key: string, item: CommandItem]
}
