export interface RadarSeries {
  /** Field of each data row holding the value. */
  key: string
  label?: string
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
}

export type RadarDatum = Record<string, unknown>

/** An axis with the values of every series. Passed to slots and events. */
export interface RadarAxisItem {
  index: number
  label: string
  datum: RadarDatum
  values: { key: string; label: string; value: number; formatted: string; color: string }[]
  /** Average of the series values on this axis. */
  average: number
}

export interface RadarChartProps {
  /** One row per axis. */
  data: RadarDatum[]
  /** Field holding the axis label. */
  labelKey?: string
  series: RadarSeries[]
  /**
   * `filled`: solid area. `dots`: area plus a dot on every vertex.
   * `lines`: outlines only. `score`: values beside the labels and an average in the center.
   */
  variant?: 'filled' | 'dots' | 'lines' | 'score'
  /** Radius ceiling. Defaults to the largest value. */
  max?: number
  /** Number of concentric grid polygons. */
  rings?: number
  /** Diameter of the chart area in px (labels excluded). */
  size?: number
  /** Values below this turn red in the `score` variant. */
  alertBelow?: number
  showLabels?: boolean
  formatValue?: (value: number) => string
  interactive?: boolean
  /** Highlighted axis index. Supports v-model:focused. */
  focused?: number | null
  animated?: boolean
  label?: string
  class?: string
}

export interface RadarChartSlots {
  /** Center of the chart. Always rendered in the `score` variant. */
  center?: (props: { average: number; focusedAxis: RadarAxisItem | null }) => unknown
}
