export type ColorSwatchShape = 'circle' | 'square'
export type ColorSwatchSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ColorSwatchProps {
  /** Any valid CSS color value. */
  color: string
  /** Shape of the swatch. */
  shape?: ColorSwatchShape
  /** Size of the swatch. */
  size?: ColorSwatchSize
  /** Additional CSS classes. */
  class?: string
}
