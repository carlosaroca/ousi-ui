export type SeparatorOrientation = 'horizontal' | 'vertical'
export type SeparatorVariant = 'default' | 'secondary' | 'tertiary'

export interface SeparatorProps {
  /** Layout direction. */
  orientation?: SeparatorOrientation
  /** Color variant. */
  variant?: SeparatorVariant
  /** Additional CSS classes. */
  class?: string
}
