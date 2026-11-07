export interface TreemapNode {
  /** Unique key among its siblings. Falls back to the name. */
  id?: string
  name: string
  /** Size of the node. Ignored when it has children (their sum is used). */
  value?: number
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
  /** One more level of nodes drawn inside this one. */
  children?: TreemapNode[]
}

/** A tile with its derived values. Passed to slots and events. */
export interface TreemapItem {
  /** `2` for a top-level node, `2.1` for its second child. */
  key: string
  name: string
  value: number
  /** Share of the grand total (0-100, one decimal). */
  percent: number
  /** 0 for top-level nodes, 1 for children. */
  depth: number
  /** Name of the parent, for children. */
  parent: string | null
  color: string
  formatted: string
  /** Position and size inside the chart, in px. */
  x: number
  y: number
  w: number
  h: number
  hasChildren: boolean
}

export interface TreemapProps {
  data: TreemapNode[]
  /** Chart height in px. Width is fluid. */
  height?: number
  /** Space between tiles in px. */
  gap?: number
  /** Corner radius of the tiles in px. */
  radius?: number
  /** Show the name and value inside the tiles that are large enough. */
  showLabels?: boolean
  formatValue?: (value: number) => string
  interactive?: boolean
  /** Show the built-in tooltip (replaceable with the `tooltip` slot). */
  tooltip?: boolean
  /** Highlighted tile: `"2"` or `"2.1"`. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it. */
  focused?: string | null
  animated?: boolean
  label?: string
  class?: string
}

export interface TreemapSlots {
  /** Content of each tile. Replaces the default name and value. */
  label?: (props: { item: TreemapItem; focused: boolean }) => unknown
  tooltip?: (props: { item: TreemapItem }) => unknown
}
