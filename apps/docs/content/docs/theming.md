---
title: Theming
description: Customize the look and feel of Ousi UI with design tokens and themes.
---

# Theming

Ousi UI uses CSS custom properties (design tokens) for all colors, spacing, radii, and shadows. Tailwind v4's `@theme inline` directive maps these tokens into utility classes like `bg-ousi-accent`, `rounded-ousi-lg`, etc.

## Design tokens

All tokens are prefixed with `--ousi-` and defined in your active theme's CSS file (e.g., `ousi-dark.css`).

### Colors

| Token | Utility class | Description |
|-------|---------------|-------------|
| `--ousi-background` | `bg-ousi-background` | Page background |
| `--ousi-foreground` | `text-ousi-foreground` | Primary text color |
| `--ousi-surface` | `bg-ousi-surface` | Card/surface background |
| `--ousi-surface-secondary` | `bg-ousi-surface-secondary` | Secondary surfaces |
| `--ousi-muted` | `text-ousi-muted` | Muted text |
| `--ousi-accent` | `bg-ousi-accent` | Primary accent color |
| `--ousi-success` | `bg-ousi-success` | Success state |
| `--ousi-warning` | `bg-ousi-warning` | Warning state |
| `--ousi-danger` | `bg-ousi-danger` | Danger/error state |
| `--ousi-border` | `border-ousi-border` | Border color |

### Radius

The radius system uses a single `--ousi-radius` base value with calculated scales from `xs` to `4xl`. Use classes like `rounded-ousi-sm`, `rounded-ousi-md`, `rounded-ousi-xl`.

### Shadows

Layered elevation scale (Josh Comeau technique): `shadow-ousi-xs`, `shadow-ousi-sm`, `shadow-ousi-md`, `shadow-ousi-lg`, `shadow-ousi-xl`, `shadow-ousi-2xl`. Each level stacks 1–5 box-shadows with a 1:2 horizontal:vertical offset ratio. Override `--ousi-shadow-color` (HSL components) on any container to retint its descendants' shadows.

### Easing

Built-in easing curves: `ease-ousi-smooth`, `ease-ousi-out-fluid`, `ease-ousi-out-expo`, `ease-ousi-in-out-quart`.

## Switching themes

Toggle between dark and light themes by setting the `data-theme` attribute:

```typescript
// Switch to light theme
document.documentElement.setAttribute('data-theme', 'light')

// Switch to dark theme
document.documentElement.setAttribute('data-theme', 'dark')
```

## Custom themes

Create a custom theme by defining the CSS custom properties in your own CSS file:

```css
[data-theme="custom"] {
  color-scheme: dark;

  --ousi-background: oklch(12% 0.005 285);
  --ousi-foreground: oklch(99% 0 0);
  --ousi-surface: oklch(21% 0.006 286);
  --ousi-accent: oklch(62% 0.195 254);
  /* ... all other --ousi-* tokens */
}
```

Then import it alongside the shared theme utilities:

```css
@import "tailwindcss";
@import "@ousi-ui/theme/shared/theme";
@import "./my-custom-theme.css";
```
