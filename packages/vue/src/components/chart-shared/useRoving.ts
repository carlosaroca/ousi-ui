import { ref } from 'vue'

/**
 * Roving tabindex for charts with many interactive items (WAI-ARIA composite widget pattern).
 * Only one item is a tab stop, so Tab enters and leaves the chart in one press;
 * arrow keys, Home and End move between items.
 *
 * Mark the root element with `data-roving-root` and every item with `:data-roving="index"`.
 * In a 2D layout pass `columns` so ArrowUp/ArrowDown move by a whole row.
 */
export function useRoving(count: () => number, columns: () => number = () => 0) {
  const active = ref(0)
  const current = () => Math.min(Math.max(active.value, 0), Math.max(count() - 1, 0))

  /** 0 for the active item, -1 for the rest, undefined when the chart is not interactive. */
  function tabindexFor(index: number, interactive = true): 0 | -1 | undefined {
    if (!interactive) return undefined
    return index === current() ? 0 : -1
  }

  function activate(index: number) {
    active.value = index
  }

  function onKeydown(e: KeyboardEvent, index: number) {
    const n = count()
    if (!n) return
    const cols = columns()
    let from = index
    let step: number
    switch (e.key) {
      case 'ArrowRight': step = 1; break
      case 'ArrowLeft': step = -1; break
      case 'ArrowDown': step = cols || 1; break
      case 'ArrowUp': step = -(cols || 1); break
      case 'Home': from = -1; step = 1; break
      case 'End': from = n; step = -1; break
      default: return
    }
    e.preventDefault()
    const root = (e.currentTarget as Element | null)?.closest('[data-roving-root]')
    if (!root) return
    // Skip indexes that are not rendered (e.g. a node with no links)
    for (let next = from + step; next >= 0 && next < n; next += step) {
      const el = root.querySelector<HTMLElement | SVGElement>(`[data-roving="${next}"]`)
      if (el) {
        active.value = next
        el.focus()
        return
      }
    }
  }

  return { tabindexFor, activate, onKeydown }
}
