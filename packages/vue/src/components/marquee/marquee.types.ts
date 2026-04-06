export type MarqueeDirection = 'left' | 'right' | 'up' | 'down'

export interface MarqueeProps {
  direction?: MarqueeDirection
  speed?: number
  pauseOnHover?: boolean
  gap?: number
  class?: string
}
