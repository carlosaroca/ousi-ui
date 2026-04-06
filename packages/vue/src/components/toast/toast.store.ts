import { ref } from 'vue'
import type { ToastItem } from './toast.types'

export const toastStore = ref<ToastItem[]>([])

export function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
