import { ref, type Ref } from 'vue'
import { Keys, isKey } from '../utils/keyboard'

export interface UseListNavigationOptions {
  /** Total number of items. */
  itemCount: Ref<number>
  /** Current active index. */
  activeIndex?: Ref<number>
  /** Orientation of the list. */
  orientation?: 'horizontal' | 'vertical'
  /** Whether to loop around at the ends. */
  loop?: boolean
  /** Callback when active index changes. */
  onActiveIndexChange?: (index: number) => void
}

/**
 * Handles keyboard navigation for lists (menus, listboxes, etc.).
 */
export function useListNavigation(options: UseListNavigationOptions) {
  const {
    itemCount,
    orientation = 'vertical',
    loop = true,
    onActiveIndexChange,
  } = options

  const activeIndex = options.activeIndex ?? ref(-1)

  const nextKey = orientation === 'vertical' ? Keys.ArrowDown : Keys.ArrowRight
  const prevKey = orientation === 'vertical' ? Keys.ArrowUp : Keys.ArrowLeft

  function goTo(index: number) {
    activeIndex.value = index
    onActiveIndexChange?.(index)
  }

  function next() {
    const count = itemCount.value
    if (count === 0) return
    const nextIndex = activeIndex.value + 1
    goTo(nextIndex >= count ? (loop ? 0 : count - 1) : nextIndex)
  }

  function prev() {
    const count = itemCount.value
    if (count === 0) return
    const prevIndex = activeIndex.value - 1
    goTo(prevIndex < 0 ? (loop ? count - 1 : 0) : prevIndex)
  }

  function first() {
    goTo(0)
  }

  function last() {
    goTo(Math.max(0, itemCount.value - 1))
  }

  function onKeyDown(event: KeyboardEvent) {
    if (isKey(event, nextKey)) {
      event.preventDefault()
      next()
    } else if (isKey(event, prevKey)) {
      event.preventDefault()
      prev()
    } else if (isKey(event, Keys.Home)) {
      event.preventDefault()
      first()
    } else if (isKey(event, Keys.End)) {
      event.preventDefault()
      last()
    }
  }

  return {
    activeIndex,
    onKeyDown,
    next,
    prev,
    first,
    last,
    goTo,
  }
}
