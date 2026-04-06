import { reactive } from 'vue'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
  duration?: number
}

export interface ToastStore {
  toasts: Toast[]
  add: (toast: Omit<Toast, 'id'>) => string
  remove: (id: string) => void
  clear: () => void
}

let counter = 0

function createToastStore(): ToastStore {
  const state = reactive<{ toasts: Toast[] }>({ toasts: [] })

  function add(toast: Omit<Toast, 'id'>): string {
    counter += 1
    const id = `toast-${counter}`
    const entry: Toast = { id, duration: 5000, variant: 'default', ...toast }
    state.toasts.push(entry)

    if (entry.duration && entry.duration > 0) {
      setTimeout(() => remove(id), entry.duration)
    }

    return id
  }

  function remove(id: string) {
    const index = state.toasts.findIndex((t) => t.id === id)
    if (index !== -1) {
      state.toasts.splice(index, 1)
    }
  }

  function clear() {
    state.toasts.splice(0, state.toasts.length)
  }

  return {
    toasts: state.toasts,
    add,
    remove,
    clear,
  }
}

/** Singleton toast store. */
export const toastStore = createToastStore()

/** Convenience function. */
export function toast(options: Omit<Toast, 'id'>): string {
  return toastStore.add(options)
}
