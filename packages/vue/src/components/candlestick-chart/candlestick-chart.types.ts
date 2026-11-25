export interface CandleDatum {
  /** Unique key. Falls back to the label. */
  id?: string
  /** The period: a date, a time. */
  label: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

/** A candle with its derived values. Passed to slots and events. */
export interface CandleItem {
  key: string
  index: number
  label: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
  /** Closed at or above where it opened. */
  rising: boolean
  /** Close less open, and that as a share of the open (0-100, two decimals). */
  change: number
  changePercent: number
  color: string
  formatted: { open: string; high: string; low: string; close: string; volume?: string }
}

export interface CandlestickChartProps {
  data: CandleDatum[]
  /** Chart height in px. Width is fluid. */
  height?: number
  upColor?: string
  downColor?: string
  /** Corner radius of the candle bodies, in px. */
  barRadius?: number
  /** Space between candles as a share of each slot, from 0 to 0.9. */
  barGap?: number
  /** The widest a candle body gets, in px, when there are few of them. */
  maxBarWidth?: number
  /** Bars of volume along the bottom, for data that has it. */
  showVolume?: boolean
  grid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  formatValue?: (value: number) => string
  formatVolume?: (value: number) => string
  /** Words for the tooltip and screen readers. */
  labels?: Partial<Record<'open' | 'high' | 'low' | 'close' | 'volume', string>>
  interactive?: boolean
  tooltip?: boolean
  /** Highlighted candle. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it. */
  focused?: number | null
  animated?: boolean
  label?: string
  class?: string
}

export interface CandlestickChartSlots {
  tooltip?: (props: { candle: CandleItem }) => unknown
}
