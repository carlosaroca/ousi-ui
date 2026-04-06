export type GradientTextPreset = 'aurora' | 'sunset' | 'ocean' | 'candy' | 'neon'

export interface GradientTextProps {
  preset?: GradientTextPreset
  from?: string
  via?: string
  to?: string
  animate?: boolean
  duration?: number
  class?: string
}
