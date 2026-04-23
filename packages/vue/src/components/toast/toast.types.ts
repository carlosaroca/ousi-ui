export type ToastVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger'
export type ToastPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
export type ToastShadow = 'sm' | 'md' | 'lg' | 'xl'

export interface ToastAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'text' | 'outline' | 'soft' | 'danger'
}

export interface ToastOptions {
  description?: string
  variant?: ToastVariant
  timeout?: number
  isLoading?: boolean
  /** Custom SVG icon (inner SVG content string). Overrides variant icon. */
  icon?: string
  /** Called when the toast is dismissed by user (X button or action click). */
  onClose?: () => void
  /** Called when the toast auto-dismisses after timeout. */
  onAutoClose?: () => void
  action?: ToastAction
}

export interface ToastItem extends ToastOptions {
  id: string
  title: string
  createdAt: number
}

export interface ToastProviderProps {
  placement?: ToastPlacement
  maxVisible?: number
  /** Elevation shadow applied to each toast item. Defaults to 'lg'. */
  shadow?: ToastShadow
}

export interface PromiseOptions<T> {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((err: Error) => string)
}
