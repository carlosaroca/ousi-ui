import { ref } from 'vue'

export interface UseTypeaheadOptions {
  /** Returns the text content of an item by index. */
  getItemText: (index: number) => string
  /** Total item count. */
  itemCount: () => number
  /** Callback when a match is found. */
  onMatch: (index: number) => void
  /** Delay to reset the search buffer (ms). */
  resetDelay?: number
}

/**
 * Typeahead search for list components. Accumulates typed characters
 * and finds the first matching item.
 */
export function useTypeahead(options: UseTypeaheadOptions) {
  const { getItemText, itemCount, onMatch, resetDelay = 500 } = options

  const search = ref('')
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  function onKeyDown(event: KeyboardEvent) {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
      return
    }

    search.value += event.key.toLowerCase()

    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      search.value = ''
    }, resetDelay)

    const count = itemCount()
    for (let i = 0; i < count; i++) {
      const text = getItemText(i).toLowerCase()
      if (text.startsWith(search.value)) {
        onMatch(i)
        break
      }
    }
  }

  function reset() {
    search.value = ''
    if (resetTimer) {
      clearTimeout(resetTimer)
      resetTimer = null
    }
  }

  return {
    search,
    onKeyDown,
    reset,
  }
}
