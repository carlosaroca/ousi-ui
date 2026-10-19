import { watch, onBeforeUnmount, type Ref } from 'vue'
import { useMounted } from './use-mounted'
import { getLayerContaining, getLayersAbove } from './use-layer'

/**
 * Returns all focusable elements within a container.
 */
function getFocusableElements(container: Element): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.tabIndex >= 0 &&
      (typeof el.checkVisibility !== 'function' || el.checkVisibility({ visibilityProperty: true })),
  )
}

/**
 * The parts of the page the trap keeps focus in: the container, then the layers opened above its
 * own layer, like a select's list or a popover. Null while a modal layer above it has its own trap.
 */
function getTrapScopes(container: HTMLElement): Element[] | null {
  const layer = getLayerContaining(container)
  if (!layer) return [container]
  const above = getLayersAbove(layer)
  if (above.some((l) => l.modal)) return null
  return [container, ...above.flatMap((l) => l.elements())]
}

function follows(from: Node, el: Node): boolean {
  return !!(from.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
}

function precedes(from: Node, el: Node): boolean {
  return !!(from.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)
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

  // Tab moves natively inside each scope. At a scope's edge it goes on to the next scope, and from
  // the last one back to the first, so focus never leaves for the page behind.
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || event.defaultPrevented) return

    const container = containerRef.value
    if (!container) return

    const scopes = getTrapScopes(container)
    if (!scopes) return

    const lists = scopes.map(getFocusableElements)
    const backward = event.shiftKey
    const active = document.activeElement
    const current = active ? scopes.findIndex((scope) => scope.contains(active)) : -1

    if (current !== -1 && active) {
      const staysInside = backward
        ? lists[current].some((el) => precedes(active, el))
        : lists[current].some((el) => follows(active, el))
      if (staysInside) return
    }

    event.preventDefault()
    const count = scopes.length
    const start = current === -1 ? (backward ? 0 : count - 1) : current
    for (let step = 1; step <= count; step++) {
      const index = (start + (backward ? -step : step) + count * 2) % count
      const list = lists[index]
      if (list.length > 0) {
        ;(backward ? list[list.length - 1] : list[0]).focus()
        return
      }
    }
  }

  // Focus already in the container or a layer above it stays put, and so does focus under a modal
  // layer opened above it meanwhile.
  function needsInitialFocus(container: HTMLElement): boolean {
    const scopes = getTrapScopes(container)
    const active = document.activeElement
    return !!scopes && !scopes.some((scope) => !!active && scope.contains(active))
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
            if (needsInitialFocus(container)) initialFocusTarget(container).focus()
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
