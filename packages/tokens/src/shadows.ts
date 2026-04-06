export const shadows = {
  light: {
    surface: '0 2px 4px 0 rgba(0,0,0,0.04), 0 1px 2px 0 rgba(0,0,0,0.06), 0 0 1px 0 rgba(0,0,0,0.06)',
    overlay: '0 2px 8px 0 rgba(0,0,0,0.06), 0 -6px 12px 0 rgba(0,0,0,0.03), 0 14px 28px 0 rgba(0,0,0,0.08)',
    field: '0 2px 4px 0 rgba(0,0,0,0.04), 0 1px 2px 0 rgba(0,0,0,0.06), 0 0 1px 0 rgba(0,0,0,0.06)',
  },
  dark: {
    surface: '0 0 0 0 transparent inset',
    overlay: '0 0 1px 0 rgba(255,255,255,0.3) inset',
    field: '0 0 0 0 transparent inset',
  },
} as const

export type Shadows = typeof shadows
