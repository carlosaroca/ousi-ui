export interface BreadcrumbItem {
  label: string
  href?: string
  disabled?: boolean
  onClick?: () => void
}

export interface BreadcrumbsProps {
  /** List of breadcrumb items. Last item is treated as current page. */
  items: BreadcrumbItem[]
  /** Separator type between items. */
  separator?: 'chevron' | 'slash' | 'dot'
  /** Additional CSS classes. */
  class?: string
}

export interface BreadcrumbsEmits {
  navigate: [item: BreadcrumbItem, index: number]
}
