/**
 * Checks if code is running in a browser environment.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * Returns the ownerDocument of an element, or the global document.
 */
export function getOwnerDocument(el?: Element | null): Document {
  return el?.ownerDocument ?? document
}

/**
 * Returns the active element within a document.
 */
export function getActiveElement(doc?: Document): Element | null {
  const d = doc ?? (isBrowser() ? document : null)
  return d?.activeElement ?? null
}

/**
 * Checks if an element contains another element.
 */
export function contains(parent: Element | null, child: Element | null): boolean {
  if (!parent || !child) return false
  return parent === child || parent.contains(child)
}

/**
 * Focus an element safely, no-op during SSR.
 */
export function focusElement(el: HTMLElement | null, options?: FocusOptions): void {
  if (!el || !isBrowser()) return
  requestAnimationFrame(() => {
    el.focus(options)
  })
}
