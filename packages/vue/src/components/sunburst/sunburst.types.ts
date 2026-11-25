import type { TreemapNode } from '../treemap'

/** The same shape as a treemap's, so the same data draws either. */
export type SunburstNode = TreemapNode

/** A sector with its derived values. Passed to slots and events. */
export interface SunburstItem {
  /** `2` for the third top-level node, `2.0` for its first child. */
  key: string
  name: string
  value: number
  /** Share of what is in view (0-100, one decimal). */
  percent: number
  /** 1 for the ring next to the centre. */
  depth: number
  /** Name of the parent, if it has one. */
  parent: string | null
  color: string
  formatted: string
  hasChildren: boolean
}

export interface SunburstProps {
  data: SunburstNode[]
  /** Diameter in px. It shrinks to fit. */
  size?: number
  /** How many rings to draw at once. */
  levels?: number
  /** Size of the hole as a share of the radius, from 0.2 to 0.8. */
  innerRadius?: number
  /** Space between sectors and between rings, in viewBox units (0-100 scale). */
  gap?: number
  /** Roundness of the sectors' corners, in viewBox units. 0 makes them sharp. */
  cornerRadius?: number
  /** Write names on the sectors with room for them. */
  showLabels?: boolean
  /** Clicking a sector with children brings it to the centre; the centre goes back. */
  zoomable?: boolean
  /** Key of the node at the centre, or null for the whole (v-model:zoom). Optional. */
  zoom?: string | null
  /** Name of the whole, shown in the centre. */
  rootLabel?: string
  formatValue?: (value: number) => string
  interactive?: boolean
  /** Highlighted sector. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it. */
  focused?: string | null
  animated?: boolean
  label?: string
  class?: string
}

export interface SunburstSlots {
  /** The centre. */
  default?: (props: { total: number; formattedTotal: string; focusedItem: SunburstItem | null; current: SunburstItem | null }) => unknown
}
