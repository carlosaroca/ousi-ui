import type { Directive } from 'vue'
import { HapticsEngine } from './haptics.engine'
import type { HapticPreset } from './haptics.types'

/**
 * v-haptic directive — adds haptic feedback to any element.
 *
 * Usage:
 *   <button v-haptic>Click me</button>           → 'medium' preset
 *   <button v-haptic="'heavy'">Delete</button>   → 'heavy' preset
 *   <button v-haptic="'none'">Cancel</button>    → disabled
 *
 * On Android: uses navigator.vibrate() on click.
 * On iOS: injects an invisible <input type="checkbox" switch> overlay
 *         that receives the real touch → triggers Taptic Engine.
 *         The click event bubbles through to the actual element.
 */

const engine = new HapticsEngine()
const isIOS = HapticsEngine.isIOS && typeof navigator !== 'undefined' && typeof navigator.vibrate !== 'function'

function createOverlay(): HTMLInputElement {
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.setAttribute('switch', '')
  input.setAttribute('aria-hidden', 'true')
  input.tabIndex = -1
  Object.assign(input.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    opacity: '0.001',
    zIndex: '1',
    cursor: 'inherit',
    margin: '0',
    padding: '0',
    appearance: 'auto',
    WebkitAppearance: 'none',
    border: 'none',
    background: 'none',
    pointerEvents: 'auto',
  })
  // Keep appearance: auto for the switch attribute but make it invisible
  input.style.setProperty('appearance', 'auto', 'important')
  return input
}

export const vHaptic: Directive<HTMLElement, HapticPreset | 'none' | undefined> = {
  mounted(el, binding) {
    const preset = binding.value ?? 'medium'
    if (preset === 'none') return

    if (isIOS) {
      // iOS: inject checkbox overlay into the element
      // The element needs position: relative for the overlay to cover it
      const computed = window.getComputedStyle(el)
      if (computed.position === 'static') {
        el.style.position = 'relative'
      }

      const overlay = createOverlay()
      overlay.dataset.hapticOverlay = 'true'

      // Prevent the checkbox from stealing focus or changing visuals
      overlay.addEventListener('focus', (e) => e.preventDefault(), true)

      el.appendChild(overlay)
    } else if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      // Android: trigger vibration on click
      const handler = () => engine.trigger(preset)
      el.addEventListener('click', handler)
      ;(el as any).__hapticHandler = handler
    }
  },

  updated(el, binding) {
    const preset = binding.value ?? 'medium'
    // Update Android handler
    if (!isIOS && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      const oldHandler = (el as any).__hapticHandler
      if (oldHandler) {
        el.removeEventListener('click', oldHandler)
      }
      if (preset === 'none') {
        delete (el as any).__hapticHandler
        return
      }
      const handler = () => engine.trigger(preset)
      el.addEventListener('click', handler)
      ;(el as any).__hapticHandler = handler
    }
  },

  unmounted(el) {
    // Cleanup Android handler
    const handler = (el as any).__hapticHandler
    if (handler) {
      el.removeEventListener('click', handler)
      delete (el as any).__hapticHandler
    }
    // Cleanup iOS overlay
    const overlay = el.querySelector('[data-haptic-overlay]')
    overlay?.remove()
  },
}
