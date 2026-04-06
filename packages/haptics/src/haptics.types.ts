/** Physical presets — describe how the feedback feels. */
export type HapticPhysical = 'light' | 'medium' | 'heavy'

/** Semantic presets — describe what the feedback means. */
export type HapticSemantic = 'success' | 'error' | 'warning' | 'selection'

/** All valid haptic preset names. */
export type HapticPreset = HapticPhysical | HapticSemantic

/**
 * Value accepted by any `haptic` prop in Oasi components.
 * - HapticPreset string → triggers that pattern
 * - 'none' → explicitly disables haptics for that instance
 * - undefined → use the component's own default
 *
 * NOTE: We use 'none' instead of `false` because Vue's Boolean prop
 * coercion would default an unset `false | string` prop to `false`,
 * making it impossible to distinguish "not passed" from "explicitly disabled".
 */
export type HapticInput = HapticPreset | 'none'
