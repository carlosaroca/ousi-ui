export type ActivityRingColor = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'orange' | 'violet'

export interface ActivityRing {
  /** Unique key. Falls back to the label. */
  id?: string
  /** Ring name (e.g. "Move"). */
  label: string
  /** Current value. */
  value: number
  /** Goal for the ring. Defaults to 100. */
  max?: number
  /** Ring color: a token name or any CSS color (hex, rgb, hsl, var(--x)). Defaults to a rotating palette. */
  color?: ActivityRingColor | (string & {})
  /** Pre-formatted value shown in the stats (e.g. "1,592 kcal"). Defaults to the raw value. */
  valueLabel?: string
}

export interface ActivityRingsProps {
  /** Rings from outermost to innermost. */
  rings: ActivityRing[]
  /** Diameter in px. */
  size?: number
  /** Thickness of each ring, in viewBox units (0-100 scale). */
  strokeWidth?: number
  /** Space between rings, in viewBox units. */
  gap?: number
  /** Enable hover, focus and click reactions. Disable for a purely visual graphic. */
  interactive?: boolean
  /** Show a legend with value and goal for every ring. */
  showStats?: boolean
  /** Key of the highlighted ring. Other rings are dimmed. Supports v-model:focused. */
  focused?: string | null
  /** Animate the rings on mount and when values change. Respects prefers-reduced-motion. */
  animated?: boolean
  /** Accessible label for the whole graphic. */
  label?: string
  /** Additional CSS classes. */
  class?: string
}

/** A ring with its resolved geometry and display values. Passed to slots and events. */
export interface ActivityRingItem {
  key: string
  index: number
  label: string
  value: number
  max: number
  /** Progress between 0 and 1. */
  progress: number
  /** Progress as a rounded percentage (0-100). */
  percent: number
  /** Resolved CSS color. */
  color: string
  /** Formatted value (falls back to the raw value). */
  valueLabel: string
}

export interface ActivityRingsSlots {
  /** Center of the rings. Receives the focused ring so it can react to hover. */
  default?: (props: { focusedRing: ActivityRingItem | null; rings: ActivityRingItem[] }) => unknown
  /** Content of each legend item (only with `showStats`). */
  stat?: (props: { ring: ActivityRingItem; index: number; focused: boolean; dimmed: boolean }) => unknown
  /** Replaces the whole legend. */
  stats?: (props: {
    rings: ActivityRingItem[]
    focusedKey: string | null
    setFocus: (key: string | null) => void
  }) => unknown
}
