export interface ComboChartSeries {
  /** Field of each data row holding the value. */
  key: string
  /** Display name (tooltip, aria). Defaults to the key. */
  label?: string
  /** Any CSS color, e.g. 'var(--ousi-accent)' or '#6366f1'. */
  color?: string
  /** Formats values for ticks and tooltip. Defaults to toLocaleString. */
  format?: (value: number) => string
}

export type ComboChartDatum = Record<string, unknown>

export interface ComboChartPadding {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export interface ComboChartProps {
  /** One row per category. */
  data: ComboChartDatum[]
  /** Field holding the category label. */
  categoryKey: string
  /** Bar series (left axis). */
  bar: ComboChartSeries
  /** Line series (right axis). Optional. */
  line?: ComboChartSeries
  /** Chart height in px. Width is fluid. */
  height?: number
  /** Show horizontal grid lines. */
  grid?: boolean
  /** Line interpolation. */
  curve?: 'smooth' | 'linear'
  /** Corner radius of the bars, in px. */
  barRadius?: number
  /** Which bar corners are rounded: only the top ones, or all of them. */
  barCorners?: 'top' | 'all'
  /** Show the category labels under the plot. */
  showXAxis?: boolean
  /** Show the left axis labels (bar series). */
  showBarAxis?: boolean
  /** Show the right axis labels (line series). */
  showLineAxis?: boolean
  /** Show a dot on the line at every category. */
  showPoints?: boolean
  /** Space between bars as a fraction of the band (0-0.9). */
  barGap?: number
  /** Enable hover, focus and click reactions. */
  interactive?: boolean
  /** Show the built-in tooltip (replaceable with the `tooltip` slot). */
  tooltip?: boolean
  /** Index of the highlighted category. Supports v-model:focused. */
  focused?: number | null
  /** Animate on mount and when data changes. Respects prefers-reduced-motion. */
  animated?: boolean
  /** Inner spacing around the plot, in px (room for the axis labels). */
  padding?: ComboChartPadding
  /** Accessible label. */
  label?: string
  /** Additional CSS classes. */
  class?: string
}

/** Resolved values of a category, passed to slots and events. */
export interface ComboChartPoint {
  index: number
  category: string
  datum: ComboChartDatum
  bar: { value: number; formatted: string; color: string; label: string }
  line: { value: number; formatted: string; color: string; label: string } | null
  /** Horizontal center of the category inside the chart, in px. */
  x: number
}

export interface ComboChartSlots {
  /** Replaces the tooltip content. */
  tooltip?: (props: { point: ComboChartPoint }) => unknown
}
