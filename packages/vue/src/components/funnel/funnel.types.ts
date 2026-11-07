export interface FunnelStage {
  /** Unique key. Falls back to the label. */
  id?: string
  label: string
  value: number
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
}

/** A stage with its derived values. Passed to slots and events. */
export interface FunnelItem {
  key: string
  index: number
  label: string
  value: number
  /** Share of the first stage (0-100). */
  percent: number
  /** Share of the previous stage (0-100). 100 for the first stage. */
  stepPercent: number
  /** Formatted value. */
  formatted: string
  color: string
}

export interface FunnelProps {
  /** Stages, top of the funnel first. */
  stages: FunnelStage[]
  /** `columns`: one continuous flow, each stage blending into the next. `bars`: one pill per row. */
  variant?: 'columns' | 'bars'
  /** Transition between stages: `smooth` S-curves or `sharp` straight lines (columns only). */
  shape?: 'smooth' | 'sharp'
  /** Use a single neutral tone for every stage. */
  mono?: boolean
  /** Height of the columns in px (columns only). */
  height?: number
  /** Show the share of the first stage on each stage. */
  showPercent?: boolean
  /** Show a tile per stage under the flow, with its color, label and value (columns only). */
  showLegend?: boolean
  /** Soft halo around the flow, in layers (columns only). */
  halo?: boolean
  /** Formats stage values. Defaults to toLocaleString. */
  formatValue?: (value: number) => string
  /** Enable hover, focus and click reactions. */
  interactive?: boolean
  /** Index of the highlighted stage. Supports v-model:focused. */
  focused?: number | null
  /** Animate on mount and when data changes. */
  animated?: boolean
  /** Accessible label. */
  label?: string
  /** Additional CSS classes. */
  class?: string
}

export interface FunnelSlots {
  /** Content of each legend tile (columns), or the right side of each row (bars). */
  stage?: (props: { item: FunnelItem; focused: boolean; dimmed: boolean }) => unknown
  /** Content at the left end of each bar (e.g. an icon). Bars variant only. */
  icon?: (props: { item: FunnelItem }) => unknown
}
