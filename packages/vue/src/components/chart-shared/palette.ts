const TOKENS: Record<string, string> = {
  default: 'var(--ousi-foreground)',
  accent: 'var(--ousi-accent)',
  success: 'var(--ousi-success)',
  warning: 'var(--ousi-warning)',
  danger: 'var(--ousi-danger)',
  orange: 'var(--ousi-orange)',
  violet: 'var(--ousi-violet)',
}

/** Default categorical palette used when a series, stage or node sets no color. */
export const chartPalette = [
  'var(--ousi-accent)',
  'var(--ousi-violet)',
  'var(--ousi-orange)',
  'var(--ousi-success)',
  'var(--ousi-warning)',
  'var(--ousi-danger)',
]

/** Resolves a token name ('accent', 'danger'…) or passes any CSS color through. */
export function resolveChartColor(color: string | undefined, index: number): string {
  if (!color) return chartPalette[index % chartPalette.length]
  return TOKENS[color] ?? color
}

export const chartGridColor = 'color-mix(in srgb, var(--ousi-foreground) 9%, transparent)'
