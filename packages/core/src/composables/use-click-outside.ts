import { watch, onBeforeUnmount, type Ref } from 'vue'
import { useMounted } from './use-mounted'

export interface UseClickOutsideOptions {
  /** Callback when a click occurs outside the target element(s). */
  handler: (event: PointerEvent) => void
  /** Whether the listener is active. Defaults to true. */
  enabled?: Ref<boolean>
}

/**
 * Detects clicks outside one or more elements.
 */
export function useClickOutside(
  targets: Ref<HTMLElement | null> | Ref<HTMLElement | null>[],
  options: UseClickOutsideOptions,
) {
  const { handler, enabled } = options
  const isMounted = useMounted()

  function listener(event: PointerEvent) {
    const targetList = Array.isArray(targets) ? targets : [targets]
    const clickedInside = targetList.some((target) => {
      const el = target.value
      return el && (el === event.target || el.contains(event.target as Node))
    })

    if (!clickedInside) {
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

      document.addEventListener('pointerdown', listener, true)
      cleanup = () => {
        document.removeEventListener('pointerdown', listener, true)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    cleanup?.()
  })
}
