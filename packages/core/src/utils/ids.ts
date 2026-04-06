let counter = 0

/**
 * Generates a unique id string. For Vue 3.5+, prefer `useId()` from Vue.
 * This fallback is useful in non-component contexts.
 */
export function generateId(prefix = 'ousi'): string {
  counter += 1
  return `${prefix}-${counter}`
}

/**
 * Resets the counter — only useful in tests.
 */
export function resetIdCounter(): void {
  counter = 0
}
