export type ElasticSliderSize = 'sm' | 'md' | 'lg'
export type ElasticSliderColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning'

export interface ElasticSliderProps {
  /** Current value. */
  modelValue?: number
  /** Default value when uncontrolled. */
  defaultValue?: number
  /** Minimum value. Default: 0. */
  min?: number
  /** Maximum value. Default: 100. */
  max?: number
  /** Step increment. Default: 1. */
  step?: number
  /** Number of vertical bars to render. Default: 36. */
  barCount?: number
  /** Size variant. */
  size?: ElasticSliderSize
  /** Active bar color. */
  color?: ElasticSliderColor
  /** Show value tooltip on hover/drag. Default: true. */
  showTooltip?: boolean
  /** Show percentage symbol in tooltip. */
  showPercent?: boolean
  /** Radius of the valley dip effect (number of bars affected). Default: 8. */
  waveRadius?: number
  /** Depth of the valley dip (0–1, fraction of bar height removed at center). Default: 0.85. */
  waveIntensity?: number
  /** Disable interaction. */
  disabled?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface ElasticSliderEmits {
  'update:modelValue': [value: number]
  'change': [value: number]
}
