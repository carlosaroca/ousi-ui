export interface BarSeries {
  /** Field of each data row holding the value. */
  key: string
  label?: string
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
  format?: (value: number) => string
}

export type BarChartDatum = Record<string, unknown>

/** A category with the values of every series. Passed to slots and events. */
export interface BarChartPoint {
  index: number
  category: string
  datum: BarChartDatum
  values: { key: string; label: string; value: number; formatted: string; color: string }[]
  /** Sum of the series values. */
  total: number
  formattedTotal: string
  /** Anchor of the category inside the chart, in px. */
  x: number
  y: number
}

export interface BarChartProps {
  data: BarChartDatum[]
  /** Field holding the category label. */
  categoryKey: string
  series: BarSeries[]
  orientation?: 'vertical' | 'horizontal'
  /** Stack the series in one bar instead of placing them side by side. */
  stacked?: boolean
  /** Chart height in px. Width is fluid. */
  height?: number
  /** Draw a full-length rounded track behind each category. */
  track?: boolean
  /** Color of the track. */
  trackColor?: string
  /** Value ticks. Any list works, e.g. [0, 3000, 5000, 10000]. The axis ends at the largest one. */
  ticks?: number[]
  /** Value at the end of the axis. Defaults to a nice number above the largest value. */
  max?: number
  /** Corner radius of the bars, in px. */
  barRadius?: number
  /** Space between categories as a fraction of the band (0-0.9). */
  barGap?: number
  /** Space between bars of the same category (grouped), in px. */
  groupGap?: number
  /** Ring around the hovered category. */
  outline?: boolean
  /** Fade the other categories on hover. */
  dim?: boolean
  grid?: boolean
  /** Show the category labels. */
  showXAxis?: boolean
  /** Show the value labels. */
  showYAxis?: boolean
  formatValue?: (value: number) => string
  interactive?: boolean
  /** Show the built-in tooltip (replaceable with the `tooltip` slot). */
  tooltip?: boolean
  /** Highlighted category index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it. */
  focused?: number | null
  animated?: boolean
  padding?: { top?: number; right?: number; bottom?: number; left?: number }
  label?: string
  class?: string
}

export interface BarChartSlots {
  tooltip?: (props: { point: BarChartPoint }) => unknown
}
