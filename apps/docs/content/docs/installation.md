---
title: Installation
description: How to install and configure Ousi UI in your project.
---

# Installation

## Requirements

- Node.js 20+
- Vue 3.5+
- Tailwind CSS 4+

## Install packages

```bash
pnpm add @ousi-ui/vue @ousi-ui/theme tailwindcss @tailwindcss/vite
```

## Configure Tailwind

Ousi UI uses Tailwind v4's CSS-first configuration. Add the theme import to your main CSS file:

```css
@import "tailwindcss";
@import "@ousi-ui/theme";
```

Then register the Vite plugin in your `vite.config.ts`:

```typescript
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

No `tailwind.config.ts` file is needed — everything is handled via CSS imports.

## Available themes

Ousi UI ships with two built-in themes. The dark theme is loaded by default via `@import "@ousi-ui/theme"`. You can also import individual themes:

```css
@import "@ousi-ui/theme/themes/ousi-dark";
@import "@ousi-ui/theme/themes/ousi-light";
@import "@ousi-ui/theme/shared/theme";
```

| Theme | Selector | Description |
|-------|----------|-------------|
| `ousi-dark` | `:root`, `[data-theme="dark"]` | Dark theme with blue accent (default) |
| `ousi-light` | `[data-theme="light"]` | Light theme with blue accent |

## Nuxt integration

For Nuxt projects, add the `@tailwindcss/vite` plugin:

```bash
pnpm add @ousi-ui/vue @ousi-ui/theme tailwindcss @tailwindcss/vite
```

```typescript
// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

And in your `assets/css/main.css`:

```css
@import "tailwindcss";
@import "@ousi-ui/theme";
```
