<p align="center">
  <img src="https://raw.githubusercontent.com/carlosaroca/ousi-ui/main/gradient.png" alt="Ousi UI" width="80" />
</p>

<h1 align="center">@ousi-ui/theme</h1>

<p align="center">
  CSS themes and design tokens for <a href="https://www.npmjs.com/package/@ousi-ui/vue">@ousi-ui/vue</a>.<br/>
  Tailwind CSS v4, OKLCH color system, light & dark mode.
</p>

## Install

```bash
pnpm add @ousi-ui/theme
```

## Usage

```css
@import "tailwindcss";
@import "@ousi-ui/theme";
```

That's it. All `--ousi-*` CSS variables and Tailwind utilities (`bg-ousi-accent`, `rounded-ousi-xl`, etc.) are available.

## Themes

```css
/* Import specific themes */
@import "@ousi-ui/theme/themes/ousi-dark";
@import "@ousi-ui/theme/themes/ousi-light";
@import "@ousi-ui/theme/shared/theme";
```

Switch at runtime:

```js
document.documentElement.setAttribute('data-theme', 'dark')
```

## Customize

```css
:root {
  --ousi-accent: oklch(0.62 0.195 254);
  --ousi-radius: 0.75rem;
  --ousi-font-sans: 'Inter', system-ui, sans-serif;
}
```

Or use the [Playground](https://ousiui.com/playground) to build your theme visually.

## License

[MIT](https://github.com/carlosaroca/ousi-ui/blob/main/LICENSE) &copy; [Carlos Aroca](https://carlosaroca.com)
