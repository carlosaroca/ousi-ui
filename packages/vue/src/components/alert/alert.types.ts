export type AlertVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger'

export interface AlertProps {
  /** Color variant. */
  variant?: AlertVariant
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
