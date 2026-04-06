<p align="center">
  <img src="https://raw.githubusercontent.com/carlosaroca/ousi-ui/main/gradient.png" alt="Ousi UI" width="80" />
</p>

<h1 align="center">@ousi-ui/vue</h1>

<p align="center">
  74+ beautiful, accessible Vue 3 components.<br/>
  Built with Tailwind CSS v4, TypeScript, and OKLCH colors.
</p>

<p align="center">
  <a href="https://ousiui.com">Docs</a> &middot;
  <a href="https://ousiui.com/playground">Playground</a> &middot;
  <a href="https://github.com/carlosaroca/ousi-ui">GitHub</a>
</p>

## Install

```bash
pnpm add @ousi-ui/vue @ousi-ui/theme
```

## Setup

```css
/* main.css */
@import "tailwindcss";
@import "@ousi-ui/theme";
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [tailwindcss()] })
```

## Usage

```vue
<script setup>
import { OButton, OInput, ODialog } from '@ousi-ui/vue'
</script>

<template>
  <OButton variant="primary">Get Started</OButton>
</template>
```

## Components

Buttons, Forms, Date Pickers, Color Pickers, Charts, Modals, Tooltips, Toasts, Tables, Tabs, Accordions, and 60+ more — all with dark mode, keyboard navigation, and ARIA support.

[View all components →](https://ousiui.com/vue/components/button)

## License

[MIT](https://github.com/carlosaroca/ousi-ui/blob/main/LICENSE) &copy; [Carlos Aroca](https://carlosaroca.com)
