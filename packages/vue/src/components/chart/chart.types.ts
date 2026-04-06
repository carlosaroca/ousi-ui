export interface ChartPoint {
  time: number   // unix seconds
  value: number
}

export type ChartMomentum = 'up' | 'down' | 'flat'

export interface ChartWindowOption {
  label: string
  secs: number
}

export interface ChartReferenceLine {
  value: number
  label?: string
}

export interface ChartOrderbookData {
  bids: [number, number][]  // [price, size]
  asks: [number, number][]
}

export interface ChartPadding {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ChartDegenOptions {
  scale?: number
  downMomentum?: boolean
}

export interface CandlePoint {
  time: number   // unix seconds — candle open time
  open: number
  high: number
  low: number
  close: number
}

export interface ChartSeries {
  id: string
  data: ChartPoint[]
  value: number
  color: string
  label?: string
}

export interface ChartProps {
  // Data
  data: ChartPoint[]
  value: number

  // Multi-series mode — overrides data/value/color
  series?: ChartSeries[]

  // Candlestick mode
  mode?: 'line' | 'candle'
  candles?: CandlePoint[]
  candleWidth?: number
  liveCandle?: CandlePoint

  // Appearance
  theme?: 'light' | 'dark'
  color?: string
  grid?: boolean
  badge?: boolean
  badgeVariant?: 'default' | 'minimal'
  badgeTail?: boolean
  fill?: boolean
  pulse?: boolean

  // Features
  momentum?: boolean | ChartMomentum
  scrub?: boolean
  exaggerate?: boolean
  showValue?: boolean
  valueMomentumColor?: boolean
  degen?: boolean | ChartDegenOptions

  // Time
  window?: number
  windows?: ChartWindowOption[]
  windowStyle?: 'default' | 'rounded' | 'text'

  // Crosshair
  tooltipY?: number
  tooltipOutline?: boolean

  // Orderbook
  orderbook?: ChartOrderbookData

  // Advanced
  referenceLine?: ChartReferenceLine
  formatValue?: (v: number) => string
  formatTime?: (t: number) => string
  lerpSpeed?: number
  padding?: ChartPadding
  cursor?: string

  // Standard Ousi
  class?: string
}

export interface ChartEmits {
  'window-change': [secs: number]
  'hover': [point: (ChartPoint & { x: number; y: number }) | null]
}

/** Full derived palette for canvas rendering. */
export interface ChartPalette {
  line: string
  lineWidth: number
  fillTop: string
  fillBottom: string
  gridLine: string
  gridLabel: string
  dotUp: string
  dotDown: string
  dotFlat: string
  glowUp: string
  glowDown: string
  glowFlat: string
  badgeOuterBg: string
  badgeOuterShadow: string
  badgeBg: string
  badgeText: string
  dashLine: string
  refLine: string
  refLabel: string
  timeLabel: string
  crosshairLine: string
  tooltipBg: string
  tooltipText: string
  tooltipBorder: string
  bgRgb: [number, number, number]
  labelFont: string
  valueFont: string
  badgeFont: string
}

/** Screen-space layout computed each frame. */
export interface ChartLayout {
  w: number
  h: number
  pad: ChartPadding
  chartW: number
  chartH: number
  leftEdge: number
  rightEdge: number
  minVal: number
  maxVal: number
  valRange: number
  toX: (t: number) => number
  toY: (v: number) => number
}
