export type TableVariant = 'primary' | 'secondary'
export type SortDirection = 'asc' | 'desc' | null
export type SelectionMode = 'none' | 'single' | 'multiple'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string | number
  minWidth?: number
  maxWidth?: number
  resizable?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface SortDescriptor {
  column: string
  direction: SortDirection
}

export interface TableProps {
  /** Column definitions. */
  columns: TableColumn[]
  /** Row data array. */
  rows: Record<string, any>[]
  /** Key property on each row. Default: 'id'. */
  rowKey?: string
  /** Visual variant. */
  variant?: TableVariant
  /** Selection mode. */
  selectionMode?: SelectionMode
  /** Controlled selected row keys. */
  selectedKeys?: Set<string>
  /** Default selected keys. */
  defaultSelectedKeys?: Set<string>
  /** Controlled sort state. */
  sortDescriptor?: SortDescriptor
  /** Default sort state. */
  defaultSortDescriptor?: SortDescriptor
  /** Keys of disabled rows. */
  disabledKeys?: Set<string>
  /** Show loading skeleton. */
  isLoading?: boolean
  /** Number of skeleton rows. Default: 5. */
  loadingRows?: number
  /** Text shown when rows is empty. */
  emptyContent?: string
  /** Show the footer slot area. */
  showFooter?: boolean
  /** Enable column resizing. */
  allowsResizing?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface TableEmits {
  'selectionChange': [keys: Set<string>]
  'sortChange': [descriptor: SortDescriptor]
  'rowAction': [key: string]
}
