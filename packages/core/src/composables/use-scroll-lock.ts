import { watch, onBeforeUnmount, type Ref } from 'vue'
import { useMounted } from './use-mounted'
import { isBrowser } from '../utils/dom'

interface ScrollLockState {
  count: number
  originalOverflow: string
}

// One count for every open overlay, so nested ones unlock in any order and a closed overlay that
// mounts never touches the page. Shared like the layer stack.
const STATE_KEY = Symbol.for('ousi-ui.scroll-lock')

function getState(): ScrollLockState {
  const store = globalThis as unknown as Record<symbol, ScrollLockState | undefined>
  return (store[STATE_KEY] ??= { count: 0, originalOverflow: '' })
}

/**
 * Locks body scroll when enabled. Restores original overflow on cleanup.
 * SSR-safe — no-op on the server.
 */
export function useScrollLock(enabled: Ref<boolean>) {
  const isMounted = useMounted()
  let locked = false

  function lock() {
    if (locked) return
    locked = true
    const state = getState()
    if (state.count++ === 0) {
      state.originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
  }

  function unlock() {
    if (!locked) return
    locked = false
    const state = getState()
    if (--state.count === 0) document.body.style.overflow = state.originalOverflow
  }

  watch(
    [isMounted, enabled],
    ([mounted, shouldLock]) => {
      if (!mounted || !isBrowser()) return
      if (shouldLock) lock()
      else unlock()
    },
    { immediate: true },
  )

  onBeforeUnmount(unlock)
}
