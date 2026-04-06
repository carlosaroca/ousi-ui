import { toastStore, generateId } from './toast.store'
import { HapticsEngine } from '@ousi-ui/haptics'
import type { ToastOptions, PromiseOptions } from './toast.types'

const engine = new HapticsEngine()

const toastHapticMap: Record<string, string> = {
  success: 'success',
  danger: 'error',
  warning: 'warning',
  default: 'light',
  accent: 'light',
}

function addToast(title: string, options: ToastOptions = {}): string {
  const id = generateId()
  const timeout = options.timeout ?? 4000

  const item = {
    id,
    title,
    createdAt: Date.now(),
    variant: 'default' as const,
    ...options,
  }

  const hapticPreset = toastHapticMap[item.variant] ?? 'light'
  engine.trigger(hapticPreset as any)

  toastStore.value.unshift(item)

  if (timeout > 0 && !options.isLoading) {
    setTimeout(() => {
      const t = toastStore.value.find((t) => t.id === id)
      t?.onAutoClose?.()
      removeToast(id)
    }, timeout)
  }

  return id
}

export function removeToast(id: string): void {
  const index = toastStore.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    const t = toastStore.value[index]
    t.onClose?.()
    toastStore.value.splice(index, 1)
  }
}

export function toast(title: string, options: ToastOptions = {}): string {
  return addToast(title, options)
}

toast.success = (title: string, options: ToastOptions = {}) =>
  addToast(title, { ...options, variant: 'success' })

toast.info = (title: string, options: ToastOptions = {}) =>
  addToast(title, { ...options, variant: 'accent' })

toast.warning = (title: string, options: ToastOptions = {}) =>
  addToast(title, { ...options, variant: 'warning' })

toast.danger = (title: string, options: ToastOptions = {}) =>
  addToast(title, { ...options, variant: 'danger' })

toast.close = (id: string) => removeToast(id)

toast.clear = () => {
  toastStore.value.forEach((t) => t.onClose?.())
  toastStore.value = []
}

toast.promise = async <T>(
  promise: Promise<T>,
  options: PromiseOptions<T>,
): Promise<T> => {
  const id = addToast(options.loading, {
    isLoading: true,
    timeout: 0,
    variant: 'default',
  })

  try {
    const data = await promise
    removeToast(id)
    const msg = typeof options.success === 'function' ? options.success(data) : options.success
    addToast(msg, { variant: 'success' })
    return data
  } catch (err) {
    removeToast(id)
    const msg = typeof options.error === 'function' ? options.error(err as Error) : options.error
    addToast(msg, { variant: 'danger' })
    throw err
  }
}
