import type { HapticInput } from '@ousi-ui/haptics'
import type { OverlayBackdrop } from '../shared/backdrop'

export type DialogShadow = 'md' | 'lg' | 'xl' | '2xl'
export type DialogSize =
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  | 'cover' | 'full'

export interface DialogProps {
  /** Controls open/close state (v-model). */
  modelValue: boolean
  /** Width of the dialog, from 20rem (xs) to 64rem (5xl), capped by the viewport. `cover` fills
   *  the viewport inside its margin; `full` fills it edge to edge. */
  size?: DialogSize
  /** Elevation shadow. Defaults to 'xl'. */
  shadow?: DialogShadow
  /** Vertical placement of the dialog. */
  placement?: 'auto' | 'top' | 'center' | 'bottom'
  /** Backdrop style. Defaults to the app's `backdrop` config, 'opaque' unless set. */
  backdrop?: OverlayBackdrop
  /** How the body scrolls when content overflows. */
  scrollBehavior?: 'inside' | 'outside'
  /** Hide the built-in close button. */
  hideCloseButton?: boolean
  /** Block dismissal via Escape key or backdrop click. The close button still works
   *  unless also hidden via hideCloseButton. */
  preventClose?: boolean
  /** Haptic feedback on open. Pass false to disable. */
  haptic?: HapticInput
  /** Additional CSS classes on the dialog panel. */
  class?: string
}

export interface DialogEmits {
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
}

export interface DialogSubProps {
  class?: string
}
