export interface DockItem {
  icon: string
  label: string
  key: string
}

export interface DockProps {
  items: DockItem[]
  magnification?: number
  distance?: number
  baseSize?: number
  class?: string
}

export interface DockEmits {
  'select': [key: string, item: DockItem]
}
