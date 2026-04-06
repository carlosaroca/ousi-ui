export const radius = {
  // Base — the single value users change to rescale everything
  base: '0.5rem',

  // Field — always 1.5x base
  field: 'calc(var(--ousi-radius) * 1.5)',

  // Full scale calculated from base
  xs: 'calc(var(--ousi-radius) * 0.25)',
  sm: 'calc(var(--ousi-radius) * 0.5)',
  md: 'calc(var(--ousi-radius) * 0.75)',
  lg: 'calc(var(--ousi-radius) * 1)',
  xl: 'calc(var(--ousi-radius) * 1.5)',
  '2xl': 'calc(var(--ousi-radius) * 2)',
  '3xl': 'calc(var(--ousi-radius) * 3)',
  '4xl': 'calc(var(--ousi-radius) * 4)',
  full: '9999px',
} as const

export type Radius = typeof radius
