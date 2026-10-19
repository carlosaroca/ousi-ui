import type { OverlayBackdrop } from '../shared/backdrop'

export type DrawerPlacement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'floating-center'
  | 'floating-left' | 'floating-right'
  | 'floating-top' | 'floating-bottom'

export type DrawerBackdrop = OverlayBackdrop
export type DrawerShadow = 'md' | 'lg' | 'xl' | '2xl'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

export interface DrawerProps {
  /** Controls open/close state (v-model). */
  modelValue?: boolean
  /** Direction from which the drawer slides in. */
  placement?: DrawerPlacement
  /** Backdrop style. Defaults to the app's `backdrop` config, 'opaque' unless set. */
  backdrop?: DrawerBackdrop
  /** Elevation shadow. Defaults to 'xl'. */
  shadow?: DrawerShadow
  /** Width of a side drawer (left, right and their floating versions): sm 24rem, md 28rem,
   *  lg 36rem, xl 42rem, 2xl 56rem, never wider than 85% of the viewport; full takes the
   *  viewport but a 4rem strip (2rem on phones), for documents. Defaults to 'sm'. */
  size?: DrawerSize
  /** Show a drag handle bar. */
  showHandle?: boolean
  /** Show the built-in close button. */
  showCloseButton?: boolean
  /** Title text in the header. */
  title?: string
  /** Description text in the header. */
  description?: string
  /** Additional CSS classes on the drawer panel. */
  class?: string
}

export interface DrawerEmits {
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
}
