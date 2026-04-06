import { watch, onBeforeUnmount, type Ref } from 'vue'
import { useMounted } from './use-mounted'

/**
 * Returns all focusable elements within a container.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex >= 0,
  )
}

export interface UseFocusScopeOptions {
  /** The container element to trap focus within. */
  containerRef: Ref<HTMLElement | null>
  /** Whether focus trapping is active. */
  enabled?: Ref<boolean>
  /** Whether to auto-focus the first focusable element on mount. */
  autoFocus?: boolean
}

/**
 * Traps focus within a container element (for dialogs, modals, etc.).
 */
export function useFocusScope(options: UseFocusScopeOptions) {
  const { containerRef, enabled, autoFocus = true } = options
  const isMounted = useMounted()

  let cleanup: (() => void) | null = null

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return

    const container = containerRef.value
    if (!container) return

    const focusable = getFocusableElements(container)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(
    [isMounted, containerRef, ...(enabled ? [enabled] : [])],
    () => {
      cleanup?.()
      cleanup = null

      if (!isMounted.value) return
      if (enabled && !enabled.value) return

      const container = containerRef.value
      if (!container) return

      if (autoFocus) {
        const focusable = getFocusableElements(container)
        if (focusable.length > 0) {
          requestAnimationFrame(() => focusable[0].focus())
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      cleanup = () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    cleanup?.()
  })
}
