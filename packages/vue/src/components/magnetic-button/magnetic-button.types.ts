import type { ButtonVariant, ButtonSize } from '../button/button.types'

export interface MagneticButtonProps {
  /** Button label text. */
  label?: string
  /** Visual variant (passed to OButton). */
  variant?: ButtonVariant
  /** Button size (passed to OButton). */
  size?: ButtonSize
  /** Image URL shown in the hover popup. */
  popupSrc?: string
  /** Alt text for the popup image. */
  popupAlt?: string
  /** Popup width in px. Default: 240. */
  popupWidth?: number
  /** Magnetic pull strength (0-1). Default: 0.3. */
  magnetStrength?: number
  /** 3D tilt intensity in degrees. Default: 15. */
  tiltMax?: number
  /** Disable the effect. */
  disabled?: boolean
  /** Additional CSS classes on the button. */
  class?: string
}

export interface MagneticButtonEmits {
  'click': [event: MouseEvent]
}
