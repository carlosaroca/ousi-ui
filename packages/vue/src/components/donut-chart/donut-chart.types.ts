export interface DonutDatum {
  /** Unique key. Falls back to the label. */
  id?: string
  label: string
  value: number
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
}

/** A segment with its derived values. Passed to slots and events. */
export interface DonutItem {
  key: string
  index: number
  label: string
  value: number
  /** Share of the total (0-100, one decimal). */
  percent: number
  color: string
  formatted: string
}

export interface DonutChartProps {
  data: DonutDatum[]
  /** `donut` leaves a hole in the middle; `pie` fills it. */
  variant?: 'donut' | 'pie'
  /** Diameter in px. */
  size?: number
  /** Ring thickness in viewBox units (0-100 scale). Ignored by `pie`. */
  thickness?: number
  /** Gap between segments in degrees. */
  gap?: number
  /** Round the ends of every segment. Works best with a gap of 3 degrees or more. */
  rounded?: boolean
  /** How far the hovered segment moves outward, in viewBox units. */
  explode?: number
  /** Show a legend under the chart: swatch, label and share. */
  showLegend?: boolean
  formatValue?: (value: number) => string
  interactive?: boolean
  /** Highlighted segment index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it. */
  focused?: number | null
  animated?: boolean
  label?: string
  class?: string
}

export interface DonutChartSlots {
  /** Center of the donut. Receives the total and the hovered segment. */
  default?: (props: { total: number; formattedTotal: string; focusedItem: DonutItem | null }) => unknown
  /** Content of each legend row (only with `showLegend`). */
  legend?: (props: { item: DonutItem; focused: boolean; dimmed: boolean }) => unknown
}
