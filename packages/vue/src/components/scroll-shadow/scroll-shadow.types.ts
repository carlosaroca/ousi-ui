export type ScrollShadowOrientation = 'vertical' | 'horizontal' | 'both'

export interface ScrollShadowProps {
  /** Scroll direction. Default: 'vertical'. */
  orientation?: ScrollShadowOrientation
  /** Fade size in px. Default: 40. */
  size?: number
  /** Hide the native scrollbar. Default: true. */
  hideScrollbar?: boolean
  /** Scroll offset before activating the fade. Default: 0. */
  offset?: number
  /** Additional CSS classes. */
  class?: string
  /** Inline styles. */
  style?: any
}
