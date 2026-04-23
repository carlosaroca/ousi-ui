# Contributing to Ousi UI

Thanks for your interest in contributing! Ousi UI is an open-source project and we welcome contributions of all kinds.

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** 9+
- **Git**

### Setup

```bash
# Fork and clone
git clone https://github.com/<your-username>/ousi-ui.git
cd ousi-ui

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start docs dev server
pnpm dev --filter @ousi-ui/docs
```

The docs site runs at `http://localhost:3000`. The playground is at `/playground`.

---

## Project Structure

```
ousi-ui/
├── packages/
│   ├── vue/          # @ousi-ui/vue — 74+ Vue 3 components
│   ├── core/         # @ousi-ui/core — Composables & utilities
│   ├── theme/        # @ousi-ui/theme — CSS themes & tokens
│   ├── tokens/       # @ousi-ui/tokens — TypeScript token definitions
│   └── ...
├── apps/
│   ├── docs/         # Documentation site (Nuxt 3)
│   └── playground/   # Theme customizer (Vite)
└── tooling/          # Shared configs (tsconfig, etc.)
```

---

## How to Contribute

### Reporting Bugs

1. Search [existing issues](https://github.com/carlosaroca/ousi-ui/issues) first
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS info
   - Screenshots if applicable

### Suggesting Features

Open an issue with the `feature` label. Include:
- What problem does it solve?
- Proposed API (props, slots, emits)
- Visual reference if applicable (screenshot, Figma link, etc.)

### Fixing Bugs or Adding Features

1. Fork the repo
2. Create a branch: `git checkout -b fix/dark-mode-toast` or `feat/chart-zoom`
3. Make your changes
4. Test locally
5. Submit a PR

---

## Creating a New Component

Every component lives in `packages/vue/src/components/<name>/` and follows this structure:

```
my-component/
├── MyComponent.vue       # SFC — <script setup lang="ts">
├── my-component.types.ts # Props, Emits, Slots interfaces
├── my-component.theme.ts # CVA styling
└── index.ts              # Barrel export
```

### Step by step

**1. Types** — Define the API:

```typescript
// my-component.types.ts
export interface MyComponentProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  class?: string  // always include — merged via cn()
}
```

**2. Theme** — Use CVA for variants:

```typescript
// my-component.theme.ts
import { cva } from 'class-variance-authority'

export const myComponentTheme = cva(
  ['base', 'classes', 'here'],
  {
    variants: {
      variant: {
        primary: 'bg-ousi-accent text-ousi-accent-foreground',
        secondary: 'bg-ousi-default text-ousi-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)
```

**3. Component** — Composition API with `<script setup>`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { myComponentTheme } from './my-component.theme'
import type { MyComponentProps } from './my-component.types'

const props = withDefaults(defineProps<MyComponentProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

const classes = computed(() =>
  cn(myComponentTheme({ variant: props.variant, size: props.size }), props.class),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
```

**4. Export** — Barrel file:

```typescript
// index.ts
export { default as OMyComponent } from './MyComponent.vue'
export type { MyComponentProps } from './my-component.types'
export { myComponentTheme } from './my-component.theme'
```

**5. Register** — Add to `exports.ts` and `plugin/install.ts`

**6. Document** — Create data file in `apps/docs/data/components/` and example components in `apps/docs/components/examples/`

---

## Code Style

### General Rules

- **`<script setup lang="ts">`** — Always use Composition API
- **`cn()`** — Always merge classes with `cn()` from `@ousi-ui/core`
- **`withDefaults(defineProps<T>())`** — Always provide defaults
- **`class` prop** — Every component accepts a `class` prop (merged, never replaced)
- **No Options API** — Not in components, not in examples
- **No hardcoded colors** — Use `--ousi-*` CSS variables via Tailwind utilities

### Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Component file | PascalCase | `MyComponent.vue` |
| Component export | `O` prefix | `OMyComponent` |
| Types file | kebab-case | `my-component.types.ts` |
| Theme file | kebab-case | `my-component.theme.ts` |
| Props interface | PascalCase + `Props` | `MyComponentProps` |
| CVA function | camelCase + `Theme` | `myComponentTheme` |

### CSS Token Usage

```
bg-ousi-surface          ← surfaces
text-ousi-foreground     ← text
border-ousi-border       ← borders
rounded-ousi-xl          ← radius
shadow-ousi-lg           ← shadows (xs/sm/md/lg/xl/2xl scale)
text-ousi-accent         ← accent color
bg-ousi-danger           ← semantic color
```

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add OChart candlestick mode
fix: dark mode not working on Toast
docs: add Calendar popover examples
refactor: remove OAvatarGroup
chore: rename oasi → ousi
```

| Prefix | When |
|--------|------|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change with no behavior change |
| `perf` | Performance improvement |
| `chore` | Build, tooling, deps |

---

## Pull Request Guidelines

1. **One PR per feature/fix** — Don't bundle unrelated changes
2. **Descriptive title** — `feat: add size prop to OTabs` not `update tabs`
3. **Description** — What changed and why
4. **Screenshots** — For visual changes, include before/after
5. **Test locally** — Run `pnpm build` and verify in docs
6. **No dist files** — Don't commit `dist/` folders

### PR Template

```markdown
## What

Brief description of the change.

## Why

What problem does this solve?

## Screenshots

(if applicable)

## Checklist

- [ ] Builds without errors (`pnpm build`)
- [ ] Works in light and dark mode
- [ ] Follows component pattern (types, theme, SFC, barrel export)
- [ ] Docs updated (if adding/changing a component)
```

---

## Building & Testing

```bash
# Build everything
pnpm build

# Build specific package
pnpm --filter @ousi-ui/vue build

# Build theme (CSS copy)
pnpm --filter @ousi-ui/theme build

# Type check
pnpm --filter @ousi-ui/vue typecheck

# Start docs
pnpm dev --filter @ousi-ui/docs
```

After building `@ousi-ui/vue`, clear the docs cache to see changes:

```bash
rm -rf apps/docs/.nuxt apps/docs/node_modules/.vite
# Then restart the docs dev server
```

---

## Component Checklist

Before submitting a new component, verify:

- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive (mobile + desktop)
- [ ] Keyboard accessible (Tab, Enter, Escape, Arrows where applicable)
- [ ] Has ARIA attributes
- [ ] `class` prop supported (merged via `cn()`)
- [ ] Disabled state works
- [ ] Uses CVA for variants
- [ ] Types exported
- [ ] Registered in `exports.ts` and `plugin/install.ts`
- [ ] Docs page created with live examples
- [ ] Added to navigation in `useNavigation.ts`

---

## Questions?

- Open a [Discussion](https://github.com/carlosaroca/ousi-ui/discussions)
- Reach out on [Twitter/X](https://x.com/CarlosArocaC)

Thank you for helping make Ousi UI better!
