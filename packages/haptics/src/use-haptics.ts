import { HapticsEngine } from './haptics.engine'
import type { HapticInput } from './haptics.types'

/** Module-level singleton — shared across all composable calls. */
const engine = new HapticsEngine()

/**
 * Composable for triggering haptic feedback.
 *
 * Usage:
 * ```ts
 * const { trigger } = useHaptics()
 * trigger('light')      // triggers light haptic
 * trigger('none')       // no-op
 * trigger()             // defaults to 'medium'
 * ```
 */
export function useHaptics() {
  function trigger(input: HapticInput = 'medium'): void {
    if (input === 'none') return
    engine.trigger(input)
  }

  return {
    trigger,
    isSupported: HapticsEngine.isSupported,
  }
}
