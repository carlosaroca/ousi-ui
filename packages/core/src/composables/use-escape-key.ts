import { watch, onBeforeUnmount, type Ref } from 'vue'
import { useMounted } from './use-mounted'
import { useLayerEntry } from './use-layer'
import { Keys, isKey } from '../utils/keyboard'

export interface UseEscapeKeyOptions {
  /** Callback when Escape is pressed. */
  handler: (event: KeyboardEvent) => void
  /** Whether the listener is active. Defaults to true. */
  enabled?: Ref<boolean>
}

/**
 * Listens for the Escape key and fires the handler.
 *
 * With `enabled`, the handler joins the layer stack while enabled and runs only while it is the
 * top-most layer, like an overlay. Without it, the handler runs for every Escape that no open
 * layer took.
 */
export function useEscapeKey(options: UseEscapeKeyOptions) {
  const { handler, enabled } = options

  if (enabled) {
    useLayerEntry(enabled, {
      z: null,
      modal: false,
      elements: () => [],
      trigger: () => null,
      onEscape: handler,
      restoreFocus: false,
      returnFocus: [],
    })
    return
  }

  const isMounted = useMounted()

  function listener(event: KeyboardEvent) {
    if (isKey(event, Keys.Escape) && !event.defaultPrevented) handler(event)
  }

  watch(
    isMounted,
    (mounted) => {
      if (mounted) window.addEventListener('keydown', listener)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', listener)
  })
}
