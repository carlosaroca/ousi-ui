export type BentoGridCols = 2 | 3 | 4

export interface BentoGridProps {
  cols?: BentoGridCols
  gap?: number
  class?: string
}

export interface BentoGridItemProps {
  colSpan?: number
  rowSpan?: number
  class?: string
}
