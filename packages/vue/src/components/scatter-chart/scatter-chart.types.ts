export interface ScatterPoint {
  x: number
  y: number
  /** Third measure. When any point has it, the chart becomes a bubble chart. */
  z?: number
  label?: string
}

export interface ScatterSeries {
  label: string
  points: ScatterPoint[]
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
}

/** A point with its series. Passed to slots and events. */
export interface ScatterItem {
  seriesIndex: number
  pointIndex: number
  series: string
  color: string
  point: ScatterPoint
  /** Position inside the chart, in px. */
  cx: number
  cy: number
  formattedX: string
  formattedY: string
}

export interface ScatterFocus {
  series: number
  point: number
}

export interface ScatterChartProps {
  series: ScatterSeries[]
  height?: number
  /** Size dots by `z`. Auto-detected; pass false to force plain dots. */
  bubble?: boolean
  /** Radius range of the dots in px: [smallest, largest]. */
  radius?: [number, number]
  grid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  /** Captions for the axes. */
  axisLabels?: { x?: string; y?: string }
  formatX?: (value: number) => string
  formatY?: (value: number) => string
  interactive?: boolean
  tooltip?: boolean
  /** Highlighted point. Supports v-model:focused. */
  focused?: ScatterFocus | null
  animated?: boolean
  padding?: { top?: number; right?: number; bottom?: number; left?: number }
  label?: string
  class?: string
}

export interface ScatterChartSlots {
  tooltip?: (props: { item: ScatterItem }) => unknown
}
