export interface AreaSeries {
  /** Field of each data row holding the value. */
  key: string
  label?: string
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
  /** Dashed stroke (e.g. the previous period). */
  dashed?: boolean
  /** Fill under the line. Defaults to true for solid series and false for dashed ones. */
  fill?: boolean
  strokeWidth?: number
  format?: (value: number) => string
}

export type AreaChartDatum = Record<string, unknown>

export interface AreaChartPoint {
  index: number
  category: string
  datum: AreaChartDatum
  /** Horizontal position inside the chart, in px. */
  x: number
  values: { key: string; label: string; value: number; formatted: string; color: string }[]
}

export interface AreaChartProps {
  data: AreaChartDatum[]
  categoryKey: string
  series: AreaSeries[]
  height?: number
  grid?: boolean
  curve?: 'smooth' | 'linear'
  /** `zero` starts the axis at 0; `auto` fits the data. */
  baseline?: 'zero' | 'auto'
  fillOpacity?: number
  showXAxis?: boolean
  showYAxis?: boolean
  /** Show a dot on every category (otherwise only on hover). */
  showPoints?: boolean
  /** Default formatter for the axis and tooltip. */
  formatValue?: (value: number) => string
  interactive?: boolean
  tooltip?: boolean
  /** Highlighted category index. Supports v-model:focused. */
  focused?: number | null
  animated?: boolean
  padding?: { top?: number; right?: number; bottom?: number; left?: number }
  label?: string
  class?: string
}

export interface AreaChartSlots {
  tooltip?: (props: { point: AreaChartPoint }) => unknown
}
