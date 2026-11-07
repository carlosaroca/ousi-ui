export interface SankeyNode {
  name: string
  /** Token name or any CSS color. Defaults to the chart palette. */
  color?: string
}

export interface SankeyLink {
  /** Node name or index. */
  source: string | number
  /** Node name or index. */
  target: string | number
  value: number
}

/** A node with its derived values. Passed to events. */
export interface SankeyNodeItem {
  index: number
  name: string
  /** Flow through the node. */
  value: number
  /** Share of the total flow (0-100). */
  percent: number
  /** 0 for sources, increasing to the right. */
  column: number
  color: string
  formatted: string
}

export interface SankeyLinkItem {
  index: number
  source: SankeyNodeItem
  target: SankeyNodeItem
  value: number
  /** Share of the total flow (0-100). */
  percent: number
  formatted: string
}

/** Focus keys look like `node:2` or `link:5`. */
export type SankeyFocus = string

export interface SankeyProps {
  nodes: SankeyNode[]
  links: SankeyLink[]
  height?: number
  /** Width of the node bars in px. */
  nodeWidth?: number
  /** Vertical gap between nodes of a column in px. */
  nodePadding?: number
  showLabels?: boolean
  formatValue?: (value: number) => string
  interactive?: boolean
  /** Highlighted element: `node:<index>` or `link:<index>`. Supports v-model:focused. */
  focused?: SankeyFocus | null
  animated?: boolean
  /** Narrowest the diagram is drawn (default 400). In a narrower container it scrolls sideways instead of
   *  squeezing the flows, with an edge fade. Set 0 to always fit the container. */
  minWidth?: number
  /** Space for the labels on the sides, in px. */
  padding?: { left?: number; right?: number }
  label?: string
  class?: string
}
