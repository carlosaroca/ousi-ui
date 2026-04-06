import { ref, watch, type Ref } from 'vue'

export interface UsePresenceOptions {
  /** Whether the element should be present. */
  show: Ref<boolean>
  /** Duration of the exit animation in ms. */
  duration?: number
}

/**
 * Manages enter/leave presence for animated components.
 * `isPresent` stays true during exit animation so the element
 * can finish its CSS transition before unmounting.
 */
export function usePresence(options: UsePresenceOptions) {
  const { show, duration = 200 } = options

  const isPresent = ref(show.value)
  const isVisible = ref(show.value)

  let exitTimer: ReturnType<typeof setTimeout> | null = null

  watch(show, (shouldShow) => {
    if (exitTimer) {
      clearTimeout(exitTimer)
      exitTimer = null
    }

    if (shouldShow) {
      isPresent.value = true
      requestAnimationFrame(() => {
        isVisible.value = true
      })
    } else {
      isVisible.value = false
      exitTimer = setTimeout(() => {
        isPresent.value = false
      }, duration)
    }
  })

  return {
    /** Whether the DOM element should be mounted. */
    isPresent,
    /** Whether the element is in its "visible" state (for CSS transitions). */
    isVisible,
  }
}
