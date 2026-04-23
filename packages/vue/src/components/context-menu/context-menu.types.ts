export interface ContextMenuItem {
  label: string
  key: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  separator?: boolean
}

export type ContextMenuShadow = 'sm' | 'md' | 'lg' | 'xl'

export interface ContextMenuProps {
  items: ContextMenuItem[]
  disabled?: boolean
  /** Elevation shadow. Defaults to 'lg'. */
  shadow?: ContextMenuShadow
  class?: string
}

export interface ContextMenuEmits {
  'select': [key: string, item: ContextMenuItem]
}
