<p align="center">
  <img src="https://raw.githubusercontent.com/carlosaroca/ousi-ui/main/gradient.png" alt="Ousi UI" width="80" />
</p>

<h1 align="center">@ousi-ui/tokens</h1>

<p align="center">
  TypeScript design token definitions for <a href="https://www.npmjs.com/package/@ousi-ui/vue">Ousi UI</a>.
</p>

## Install

```bash
pnpm add @ousi-ui/tokens
```

## Usage

```ts
import { colors, spacing, radius, shadows, motion } from '@ousi-ui/tokens'
import { defineTheme, type ThemeShape } from '@ousi-ui/tokens'

const myTheme = defineTheme({
  colorScheme: 'dark',
  // ... full ThemeShape
})
```

## License

[MIT](https://github.com/carlosaroca/ousi-ui/blob/main/LICENSE) &copy; [Carlos Aroca](https://carlosaroca.com)
