import { watch, onBeforeUnmount, type Ref } from 'vue'
import { useMounted } from './use-mounted'
import { isBrowser } from '../utils/dom'

/**
 * Locks body scroll when enabled. Restores original overflow on cleanup.
 * SSR-safe — no-op on the server.
 */
export function useScrollLock(enabled: Ref<boolean>) {
  const isMounted = useMounted()
  let originalOverflow = ''

  watch(
    [isMounted, enabled],
    ([mounted, lock]) => {
      if (!mounted || !isBrowser()) return

      if (lock) {
        originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = originalOverflow
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    if (isBrowser()) {
      document.body.style.overflow = originalOverflow
    }
  })
}
