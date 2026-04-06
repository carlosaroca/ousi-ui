/**
 * ThemeContract — the mandatory schema every Oasi UI theme must implement.
 * If a theme omits any key, TypeScript will raise a build-time error.
 */

export interface ThemeShape {
  colorScheme: 'light' | 'dark'

  primitives: {
    white: string
    black: string
    snow: string
    eclipse: string
  }

  system: {
    spacing: string
    borderWidth: string
    fieldBorderWidth: string
    disabledOpacity: string
    ringOffsetWidth: string
    cursorInteractive: string
    cursorDisabled: string
  }

  radius: {
    base: string
  }

  color: {
    background: string
    foreground: string
    surface: string
    surfaceSecondary: string
    surfaceTertiary: string
    overlay: string
    muted: string
    default: string
    defaultForeground: string
    accent: string
    accentForeground: string
    success: string
    successForeground: string
    warning: string
    warningForeground: string
    danger: string
    dangerForeground: string
    border: string
    separator: string
    focus: string
  }

  field: {
    background: string
    foreground: string
    placeholder: string
    border: string
  }

  shadow: {
    surface: string
    overlay: string
    field: string
  }

  font: {
    sans: string
    mono: string
  }
}

/**
 * Empty contract object used to validate that a theme object
 * structurally matches ThemeShape at compile time.
 */
export const themeContract: ThemeShape = {
  colorScheme: 'light',

  primitives: {
    white: '',
    black: '',
    snow: '',
    eclipse: '',
  },

  system: {
    spacing: '',
    borderWidth: '',
    fieldBorderWidth: '',
    disabledOpacity: '',
    ringOffsetWidth: '',
    cursorInteractive: '',
    cursorDisabled: '',
  },

  radius: {
    base: '',
  },

  color: {
    background: '',
    foreground: '',
    surface: '',
    surfaceSecondary: '',
    surfaceTertiary: '',
    overlay: '',
    muted: '',
    default: '',
    defaultForeground: '',
    accent: '',
    accentForeground: '',
    success: '',
    successForeground: '',
    warning: '',
    warningForeground: '',
    danger: '',
    dangerForeground: '',
    border: '',
    separator: '',
    focus: '',
  },

  field: {
    background: '',
    foreground: '',
    placeholder: '',
    border: '',
  },

  shadow: {
    surface: '',
    overlay: '',
    field: '',
  },

  font: {
    sans: '',
    mono: '',
  },
}

/**
 * Helper to define a theme with full type safety against the contract.
 */
export function defineTheme(theme: ThemeShape): ThemeShape {
  return theme
}
