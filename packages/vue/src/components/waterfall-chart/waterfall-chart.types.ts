export interface WaterfallDatum {
  /** Unique key. Falls back to the label. */
  id?: string
  label: string
  /** The change to the running total, positive or negative. */
  value?: number
  /** A bar from zero showing where things stand. With a `value`, it sets the running total to it,
   *  as an opening balance does; without one, it shows what the changes have added up to. */
  total?: boolean
  /** Token name or any CSS color, instead of the colour of its kind. */
  color?: string
}

export type WaterfallKind = 'increase' | 'decrease' | 'total'

/** A bar with its derived values. Passed to slots and events. */
export interface WaterfallBar {
  key: string
  index: number
  label: string
  kind: WaterfallKind
  /** The change, or the total for a total. */
  value: number
  /** The running total before and after. A total starts at 0. */
  start: number
  end: number
  color: string
  /** The change with its sign, or the total. */
  formatted: string
  /** The running total after this bar. */
  formattedEnd: string
}

export interface WaterfallChartProps {
  data: WaterfallDatum[]
  /** Chart height in px. Width is fluid. */
  height?: number
  /** Corner radius of the bars, in px. */
  barRadius?: number
  /** Space between bars as a share of each slot, from 0 to 0.9. */
  barGap?: number
  increaseColor?: string
  decreaseColor?: string
  totalColor?: string
  /** Dashed lines carrying the level from each bar to the next. */
  connectors?: boolean
  /** Write each value above its bar, where there is room. */
  showValues?: boolean
  grid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  formatValue?: (value: number) => string
  /** Words for the tooltip and screen readers: the running total. */
  totalLabel?: string
  interactive?: boolean
  tooltip?: boolean
  /** Highlighted bar. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it. */
  focused?: number | null
  animated?: boolean
  label?: string
  class?: string
}

export interface WaterfallChartSlots {
  tooltip?: (props: { bar: WaterfallBar }) => unknown
}
