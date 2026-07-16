export type ChipVariant = 'solid' | 'outline' | 'soft' | 'text'
export type ChipColor = 'accent' | 'success' | 'warning' | 'danger' | 'default'
export type ChipSize = 'xs' | 'sm' | 'md' | 'lg'
export type ChipShadow = 'none' | 'xs' | 'sm'

export interface ChipProps {
  variant?: ChipVariant
  color?: ChipColor
  size?: ChipSize
  /** Elevation shadow. Defaults to 'none'. */
  shadow?: ChipShadow
  class?: string
}

export interface ChipSlots {
  start?: () => unknown
  default?: () => unknown
  end?: () => unknown
}
