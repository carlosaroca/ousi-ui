export type AlertVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger'
export type AlertShadow = 'none' | 'xs' | 'sm' | 'md' | 'lg'

export interface AlertProps {
  /** Color variant. */
  variant?: AlertVariant
  /** Elevation shadow. Defaults to 'none'. */
  shadow?: AlertShadow
  /** Title text (required). */
  title: string
  /** Description text. */
  description?: string
  /** Show a close button. */
  closable?: boolean
  /** Additional CSS classes. */
  class?: string
}

export interface AlertEmits {
  close: []
}
