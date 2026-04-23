export const switchTrackShadowTheme = {
  none: 'shadow-none',
  xs: 'shadow-ousi-xs',
  sm: 'shadow-ousi-sm',
} as const

export const switchLabelTheme = 'text-sm font-medium text-ousi-foreground select-none'

export const switchDescriptionTheme = 'text-sm text-ousi-muted select-none'

export const switchContentTheme = 'flex flex-col gap-0'

// Sizes — HeroUI style: pill-shaped thumb (wider than tall), 2px padding
export const switchSizes = {
  sm: {
    track: { w: 32, h: 16 },
    thumb: { w: 15, h: 12 },
    pad: 2,
  },
  md: {
    track: { w: 40, h: 20 },
    thumb: { w: 22, h: 16 },
    pad: 2,
  },
  lg: {
    track: { w: 48, h: 24 },
    thumb: { w: 27.5, h: 20 },
    pad: 2,
  },
} as const
