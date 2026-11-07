import type { ActivityRingColor } from './activity-rings.types'

export const activityRingColors: Record<ActivityRingColor, string> = {
  default: 'var(--ousi-foreground)',
  accent: 'var(--ousi-accent)',
  success: 'var(--ousi-success)',
  warning: 'var(--ousi-warning)',
  danger: 'var(--ousi-danger)',
  orange: 'var(--ousi-orange)',
  violet: 'var(--ousi-violet)',
}

/** Palette used when a ring doesn't set its own color. */
export const activityRingPalette: ActivityRingColor[] = ['danger', 'success', 'accent', 'warning', 'violet', 'orange']

export const activityRingTrackColor = 'var(--ousi-default)'
