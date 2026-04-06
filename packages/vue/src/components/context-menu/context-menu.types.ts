export interface ContextMenuItem {
  label: string
  key: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  separator?: boolean
}

export interface ContextMenuProps {
  items: ContextMenuItem[]
  disabled?: boolean
  class?: string
}

export interface ContextMenuEmits {
  'select': [key: string, item: ContextMenuItem]
}
