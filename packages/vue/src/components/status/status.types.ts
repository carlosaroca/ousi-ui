export type StatusColor = 'accent' | 'success' | 'warning' | 'danger' | 'default'
/** `dot`: colored dot, plain text. `halo`: the dot with a soft ring. `tinted`: the text takes the tone too. */
export type StatusVariant = 'dot' | 'halo' | 'tinted'
export type StatusSize = 'sm' | 'md'

export interface StatusProps {
  color?: StatusColor
  variant?: StatusVariant
  size?: StatusSize
  class?: string
}

export interface StatusSlots {
  default?: () => unknown
}
