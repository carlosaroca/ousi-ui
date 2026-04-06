import { watch, onBeforeUnmount, type Ref } from 'vue'
import { useMounted } from './use-mounted'
import { Keys, isKey } from '../utils/keyboard'

export interface UseEscapeKeyOptions {
  /** Callback when Escape is pressed. */
  handler: (event: KeyboardEvent) => void
  /** Whether the listener is active. Defaults to true. */
  enabled?: Ref<boolean>
}

/**
 * Listens for the Escape key and fires the handler.
 */
export function useEscapeKey(options: UseEscapeKeyOptions) {
  const { handler, enabled } = options
  const isMounted = useMounted()

  function listener(event: KeyboardEvent) {
    if (isKey(event, Keys.Escape)) {
      handler(event)
    }
  }

  let cleanup: (() => void) | null = null

  watch(
    [isMounted, ...(enabled ? [enabled] : [])],
    () => {
      cleanup?.()
      cleanup = null

      if (!isMounted.value) return
      if (enabled && !enabled.value) return

      document.addEventListener('keydown', listener, true)
      cleanup = () => {
        document.removeEventListener('keydown', listener, true)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    cleanup?.()
  })
}
