import type { HapticInput } from '@ousi-ui/haptics'

export type DialogShadow = 'md' | 'lg' | 'xl' | '2xl'

export interface DialogProps {
  /** Controls open/close state (v-model). */
  modelValue: boolean
  /** Size of the dialog panel. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'cover' | 'full'
  /** Elevation shadow. Defaults to 'xl'. */
  shadow?: DialogShadow
  /** Vertical placement of the dialog. */
  placement?: 'auto' | 'top' | 'center' | 'bottom'
  /** Backdrop style. */
  backdrop?: 'opaque' | 'blur' | 'transparent'
  /** How the body scrolls when content overflows. */
  scrollBehavior?: 'inside' | 'outside'
  /** Hide the built-in close button. */
  hideCloseButton?: boolean
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
