export interface GaugeSegment {
  /** Unique key. Falls back to the label. */
  id?: string
  label: string
  value: number
  /** Maximum of this segment. Its arc length is proportional to it. */
  max: number
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
  /** Pre-formatted value. */
  valueLabel?: string
}

/** A segment with its derived values. Passed to slots and events. */
export interface GaugeItem {
  key: string
  index: number
  label: string
  value: number
  max: number
  /** Fill of the segment (0-100). */
  percent: number
  color: string
  valueLabel: string
}

export interface SegmentedGaugeProps {
  segments: GaugeSegment[]
  /** Diameter in px. */
  size?: number
  /** Thickness in viewBox units (0-100 scale). */
  strokeWidth?: number
  /** Total angle of the gauge in degrees. 360 draws a full ring. */
  sweep?: number
  /** Gap between segments in degrees. */
  gap?: number
  interactive?: boolean
  /** Highlighted segment index. Supports v-model:focused. */
  focused?: number | null
  animated?: boolean
  label?: string
  class?: string
}

export interface SegmentedGaugeSlots {
  /** Center of the gauge. */
  default?: (props: { total: number; max: number; focusedSegment: GaugeItem | null }) => unknown
}
