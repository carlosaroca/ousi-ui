export type ChipVariant = 'solid' | 'outline' | 'soft' | 'ghost'
export type ChipColor = 'accent' | 'success' | 'warning' | 'danger' | 'default'
export type ChipSize = 'sm' | 'md' | 'lg'

export interface ChipProps {
  variant?: ChipVariant
  color?: ChipColor
  size?: ChipSize
  class?: string
}

export interface ChipSlots {
  start?: () => unknown
  default?: () => unknown
  end?: () => unknown
}
