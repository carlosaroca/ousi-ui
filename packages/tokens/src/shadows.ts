/**
 * Shadow tokens — layered elevation scale using the Josh Comeau technique.
 * Each level stacks multiple box-shadows with a 1:2 horizontal:vertical ratio
 * and progressively larger offsets/blurs. Shadows read as hsl(--ousi-shadow-color / α)
 * so a container can retint its descendants' shadows by overriding the HSL var.
 */

type Shadow = string

export interface ShadowScale {
  xs: Shadow
  sm: Shadow
  md: Shadow
  lg: Shadow
  xl: Shadow
  '2xl': Shadow
}

export interface Shadows {
  light: { color: string; scale: ShadowScale }
  dark: { color: string; scale: ShadowScale }
}

const buildScale = (alpha: number): ShadowScale => ({
  xs: `0.5px 1px 1px hsl(var(--ousi-shadow-color) / ${alpha})`,
  sm: [
    `1px 2px 2px hsl(var(--ousi-shadow-color) / ${alpha * 0.86})`,
    `2px 4px 4px hsl(var(--ousi-shadow-color) / ${alpha * 0.86})`,
  ].join(', '),
  md: [
    `1px 2px 2px hsl(var(--ousi-shadow-color) / ${alpha * 0.71})`,
    `2px 4px 4px hsl(var(--ousi-shadow-color) / ${alpha * 0.71})`,
    `4px 8px 8px hsl(var(--ousi-shadow-color) / ${alpha * 0.71})`,
  ].join(', '),
  lg: [
    `1px 2px 2px hsl(var(--ousi-shadow-color) / ${alpha * 0.57})`,
    `2px 4px 4px hsl(var(--ousi-shadow-color) / ${alpha * 0.57})`,
    `4px 8px 8px hsl(var(--ousi-shadow-color) / ${alpha * 0.57})`,
    `8px 16px 16px hsl(var(--ousi-shadow-color) / ${alpha * 0.57})`,
  ].join(', '),
  xl: [
    `1px 2px 2px hsl(var(--ousi-shadow-color) / ${alpha * 0.57})`,
    `2px 4px 4px hsl(var(--ousi-shadow-color) / ${alpha * 0.57})`,
    `4px 8px 8px hsl(var(--ousi-shadow-color) / ${alpha * 0.57})`,
    `8px 16px 16px hsl(var(--ousi-shadow-color) / ${alpha * 0.57})`,
    `16px 32px 32px hsl(var(--ousi-shadow-color) / ${alpha * 0.57})`,
  ].join(', '),
  '2xl': [
    `1.5px 3px 3px hsl(var(--ousi-shadow-color) / ${alpha * 0.5})`,
    `3px 6px 6px hsl(var(--ousi-shadow-color) / ${alpha * 0.5})`,
    `6px 12px 12px hsl(var(--ousi-shadow-color) / ${alpha * 0.5})`,
    `12px 24px 24px hsl(var(--ousi-shadow-color) / ${alpha * 0.5})`,
    `24px 48px 48px hsl(var(--ousi-shadow-color) / ${alpha * 0.5})`,
  ].join(', '),
})

export const shadows: Shadows = {
  light: {
    color: '220 40% 10%',
    scale: buildScale(0.4),
  },
  dark: {
    color: '0 0% 0%',
    scale: buildScale(0.55),
  },
} as const
