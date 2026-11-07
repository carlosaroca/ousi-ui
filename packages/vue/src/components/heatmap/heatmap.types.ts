export interface HeatmapRow {
  label: string
  /** One value per column. */
  values: number[]
}

export interface HeatmapCell {
  row: number
  col: number
  rowLabel: string
  colLabel: string
  value: number
  /** 0-1 position of the value inside [min, max]. */
  intensity: number
  formatted: string
}

export interface HeatmapFocus {
  row: number
  col: number
}

export interface HeatmapProps {
  rows: HeatmapRow[]
  /** Column labels. */
  columns: string[]
  /** Token name or any CSS color for the ramp. */
  color?: string
  /** Value rendered at full intensity. Defaults to the largest value. */
  max?: number
  /** Value rendered at zero intensity. */
  min?: number
  /** Number of discrete intensity steps (like a contribution calendar). 0 keeps the ramp continuous. */
  levels?: number
  /** Color of cells at or below `min`. Only used with `levels`. */
  emptyColor?: string
  /** Make the cells square. Their size then follows the available width. */
  square?: boolean
  /** Where the column labels go. */
  columnLabelsPosition?: 'top' | 'bottom'
  /** Alignment of the column labels. `start` suits sparse labels such as months. */
  columnLabelAlign?: 'center' | 'start'
  /** Show a tooltip over the hovered cell (replaceable with the `tooltip` slot). */
  tooltip?: boolean
  /** Text of the built-in tooltip and aria label. Defaults to "row · column: value". */
  cellLabel?: (cell: HeatmapCell) => string
  /** Space between cells in px. */
  gap?: number
  /** Cell height in px. Width is fluid. */
  cellHeight?: number
  /** Corner radius of the cells in px. */
  cellRadius?: number
  showRowLabels?: boolean
  showColumnLabels?: boolean
  /** Show a "less → more" scale under the grid. */
  showLegend?: boolean
  legendLabels?: [string, string]
  /** Formats values for slots and aria. Defaults to toLocaleString. */
  formatValue?: (value: number) => string
  interactive?: boolean
  /** Highlighted cell. Supports v-model:focused. */
  focused?: HeatmapFocus | null
  animated?: boolean
  label?: string
  class?: string
}

export interface HeatmapSlots {
  /** Content of each cell (e.g. the value). */
  cell?: (props: { cell: HeatmapCell; focused: boolean }) => unknown
  /** Replaces the tooltip content. */
  tooltip?: (props: { cell: HeatmapCell }) => unknown
  /** Replaces the legend. */
  legend?: () => unknown
}
