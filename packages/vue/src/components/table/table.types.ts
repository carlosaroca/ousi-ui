export type TableVariant = 'primary' | 'secondary'
export type TableShadow = 'none' | 'xs' | 'sm' | 'md'
export type TableDensity = 'compact' | 'normal' | 'relaxed'
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
  /** Pin this column to the left or right edge while the table scrolls
   *  horizontally. Multiple columns can be pinned to the same side — they stack
   *  with cumulative offsets. Sticky columns must have an explicit numeric
   *  `width` for the offset math to work; otherwise 120px is assumed. */
  sticky?: 'left' | 'right'
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
  /** Elevation shadow. Defaults to 'none'. */
  shadow?: TableShadow
  /** Selection mode. */
  selectionMode?: SelectionMode
  /** Show the checkbox column when `selectionMode='multiple'`. When false, the
   *  checkbox column is hidden and clicking anywhere on a row toggles its
   *  selection. The select-all header checkbox is also hidden. Defaults to true. */
  showSelectionColumn?: boolean
  /** Controlled selected row keys. */
  selectedKeys?: Set<string>
  /** Default selected keys. */
  defaultSelectedKeys?: Set<string>
  /** Controlled sort state (single column). */
  sortDescriptor?: SortDescriptor
  /** Default sort state (single column). */
  defaultSortDescriptor?: SortDescriptor
  /** Controlled sort state (multi-column). Used when `multiSort` is true. */
  sortDescriptors?: SortDescriptor[]
  /** Default sort state (multi-column). Used when `multiSort` is true. */
  defaultSortDescriptors?: SortDescriptor[]
  /** Allow sorting by multiple columns. shift+click on a header adds a secondary sort. */
  multiSort?: boolean
  /** Skip the client-side sort. Use when sorting happens server-side and `:rows`
   *  is already sorted. The component still emits `sort-change`. Defaults to false. */
  manualSort?: boolean
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
  /** Enable column resizing — mouse drag or keyboard ArrowLeft/Right on a focused resizer. */
  allowsResizing?: boolean
  /** Stick the header to the top while the body scrolls. */
  stickyHeader?: boolean
  /** Row height density. Defaults to 'normal'. */
  density?: TableDensity
  /** Controlled set of hidden column keys. */
  hiddenColumns?: Set<string>
  /** Default hidden columns (uncontrolled). */
  defaultHiddenColumns?: Set<string>
  /** Show an expand toggle column — pair with the `#expanded-row` slot. */
  expandable?: boolean
  /** Controlled expanded row keys. */
  expandedKeys?: Set<string>
  /** Default expanded row keys. */
  defaultExpandedKeys?: Set<string>
  /** Additional CSS classes. */
  class?: string
}

export interface TableEmits {
  'selectionChange': [keys: Set<string>]
  'sortChange': [descriptor: SortDescriptor | SortDescriptor[]]
  'expansionChange': [keys: Set<string>]
  'update:hiddenColumns': [keys: Set<string>]
  'rowAction': [key: string]
  /** Fired on right-click over a data row. Receives the row data and the
   *  native event — call `event.preventDefault()` to suppress the browser's
   *  native menu and show your own. */
  'rowContextMenu': [row: Record<string, any>, event: MouseEvent]
  /** Fired on right-click over a column header. */
  'columnContextMenu': [column: TableColumn, event: MouseEvent]
}
