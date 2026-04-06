export type AnimatedNumberAnimation = 'roll' | 'count' | 'slide' | 'fade' | 'flip'
export type AnimatedNumberTrend = 'auto' | 'up' | 'down'

export interface AnimatedNumberProps {
  /** The numeric value to display. */
  value: number
  /** Animation style. Default: 'roll'. */
  animation?: AnimatedNumberAnimation
  /** Animation duration in ms. Default: 600. */
  duration?: number
  /** Roll/slide direction. 'auto' picks based on value change. Default: 'auto'. */
  trend?: AnimatedNumberTrend
  /** Intl.NumberFormat options for formatting (locale, currency, decimals, etc.). */
  formatOptions?: Intl.NumberFormatOptions
  /** Locale string for Intl.NumberFormat. Default: undefined (browser default). */
  locale?: string
  /** Text before the number. */
  prefix?: string
  /** Text after the number. */
  suffix?: string
  /** Whether to animate on initial mount. Default: false. */
  animateOnMount?: boolean
  /** Disable all animation. */
  animated?: boolean
  /** Additional CSS classes. */
  class?: string
}
