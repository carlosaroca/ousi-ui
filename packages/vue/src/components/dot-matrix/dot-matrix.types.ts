export interface DotMatrixDatum {
  /** Column label (tooltip, aria and optional axis). */
  label?: string
  value: number
  /** Size multiplier of the whole column, from 0 to 1. Use it to fade out an unfinished period or a forecast. */
  scale?: number
  /** Token name or any CSS color for this column. Overrides `color`. */
  color?: string
}

/** A column with its derived values. Passed to slots and events. */
export interface DotMatrixItem {
  index: number
  label: string
  value: number
  /** Number of filled dots. */
  filled: number
  /** Share of `max` (0-100). */
  percent: number
  color: string
  formatted: string
  /** Horizontal center of the column inside the chart, in px. */
  x: number
  datum: DotMatrixDatum
}

export interface DotMatrixProps {
  data: DotMatrixDatum[]
  /** Dots per column. */
  rows?: number
  /** Value that fills a whole column. Defaults to the largest value. */
  max?: number
  /** Token name or any CSS color of the filled dots. */
  color?: string
  /** Color of the empty dots. */
  emptyColor?: string
  shape?: 'circle' | 'rounded' | 'square'
  /** Largest dot diameter in px. Dots shrink to fit the width. */
  dotSize?: number
  /** Space between dots in px. It shrinks (to at most 60% of a dot) when the width is tight, so dots stay readable. */
  gap?: number
  /** Draw the last filled dot proportionally to the remainder (e.g. 3.5 dots). */
  partial?: boolean
  /** Place the matrix at the start or the center when it does not use all the width. */
  align?: 'start' | 'center'
  /** Show the column labels under the matrix. */
  showLabels?: boolean
  formatValue?: (value: number) => string
  interactive?: boolean
  /** Show the built-in tooltip (replaceable with the `tooltip` slot). */
  tooltip?: boolean
  /** Highlighted column index. Optional: the chart tracks hover by itself; bind v-model:focused to read or drive it. */
  focused?: number | null
  animated?: boolean
  label?: string
  class?: string
}

export interface DotMatrixSlots {
  tooltip?: (props: { item: DotMatrixItem }) => unknown
}
