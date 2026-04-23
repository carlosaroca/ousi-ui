export type DrawerPlacement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'floating-center'
  | 'floating-left' | 'floating-right'
  | 'floating-top' | 'floating-bottom'

export type DrawerBackdrop = 'opaque' | 'blur' | 'transparent'
export type DrawerShadow = 'md' | 'lg' | 'xl' | '2xl'

export interface DrawerProps {
  /** Controls open/close state (v-model). */
  modelValue?: boolean
  /** Direction from which the drawer slides in. */
  placement?: DrawerPlacement
  /** Backdrop style. */
  backdrop?: DrawerBackdrop
  /** Elevation shadow. Defaults to 'xl'. */
  shadow?: DrawerShadow
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
