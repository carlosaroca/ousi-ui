import type { HapticPreset } from './haptics.types'

/**
 * Vibration patterns for Android (Web Vibration API).
 */
const VIBRATE_PATTERNS: Record<HapticPreset, number | number[]> = {
  selection: 20,
  light: 30,
  medium: 50,
  heavy: 80,
  success: [30, 80, 40],
  warning: [50, 60, 50],
  error: [80, 50, 80],
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export class HapticsEngine {
  static get isSupported(): boolean {
    if (typeof navigator === 'undefined') return false
    if (typeof navigator.vibrate === 'function') return true
    if (isIOS()) return true
    return false
  }

  static get isIOS(): boolean {
    return isIOS()
  }

  /** Trigger haptic — works on Android. On iOS, use the overlay approach instead. */
  trigger(preset: HapticPreset = 'medium'): void {
    if (typeof navigator === 'undefined') return

    // Android: Web Vibration API
    if (typeof navigator.vibrate === 'function') {
      const pattern = VIBRATE_PATTERNS[preset]
      if (pattern !== undefined) {
        try { navigator.vibrate(pattern) } catch {}
      }
    }

    // iOS: haptic is handled by the overlay checkbox (HapticOverlay component)
    // Programmatic .click() does NOT trigger Taptic on iOS.
    // The overlay must receive the real user touch.
  }

  stop(): void {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(0) } catch {}
    }
  }
}
