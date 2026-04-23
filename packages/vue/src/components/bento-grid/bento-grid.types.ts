export type BentoGridCols = 2 | 3 | 4

export interface BentoGridProps {
  cols?: BentoGridCols
  gap?: number
  class?: string
}

export type BentoGridItemShadow = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface BentoGridItemProps {
  colSpan?: number
  rowSpan?: number
  /** Elevation shadow. Defaults to 'none'. */
  shadow?: BentoGridItemShadow
  class?: string
}
