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
  /** Move focus into the container when it activates: an `[autofocus]` element, else the first
   *  focusable that is not a combobox (focusing one opens its list), else the container itself. */
  autoFocus?: boolean
  /** Return focus to the element that had it before the scope activated. Defaults to true. */
  restoreFocus?: boolean
}

function initialFocusTarget(container: HTMLElement): HTMLElement {
  const explicit = container.querySelector<HTMLElement>('[autofocus], [data-autofocus]')
  if (explicit) return explicit
  return (
    getFocusableElements(container).find((el) => el.getAttribute('role') !== 'combobox') ??
    container
  )
}

/**
 * Traps focus within a container element (for dialogs, modals, etc.).
 */
export function useFocusScope(options: UseFocusScopeOptions) {
  const { containerRef, enabled, autoFocus = true, restoreFocus = true } = options
  const isMounted = useMounted()

  let cleanup: (() => void) | null = null
  let isActive = false
  let returnTo: HTMLElement | null = null

  function deactivate() {
    if (!isActive) return
    isActive = false
    if (restoreFocus && returnTo?.isConnected) returnTo.focus()
    returnTo = null
  }

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

      const container = containerRef.value
      if (!isMounted.value || (enabled && !enabled.value) || !container) {
        deactivate()
        return
      }

      if (!isActive) {
        isActive = true
        returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null
        if (autoFocus) {
          requestAnimationFrame(() => {
            if (!container.contains(document.activeElement)) initialFocusTarget(container).focus()
          })
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
    deactivate()
  })
}
