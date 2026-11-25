# Ousi UI conventions

Ousi UI is a Vue 3 component library ({{COUNT}} components) built on Tailwind CSS v4 and CSS custom properties with OKLCH colors. Only the Vue package is released; Flutter is planned.

## Packages

- `@ousi-ui/vue`: the components, the `OusiUIPlugin`, and the `useOusiConfig` / `useOusiMessages` composables.
- `@ousi-ui/theme`: the CSS tokens and base styles. Imported once in the main stylesheet.
- `@ousi-ui/haptics`: optional haptic feedback, used through the `haptic` prop of some components.

## Setup

Requirements: Vue 3.5+, Tailwind CSS 4+, Node 18+.

```bash
pnpm add @ousi-ui/vue @ousi-ui/theme
```

```css
/* main.css */
@import "tailwindcss";
@import "@ousi-ui/theme";
```

Import components by name. They are tree-shakeable:

```vue
<script setup lang="ts">
import { OButton, OInput, OCard } from '@ousi-ui/vue'
</script>
```

Global registration is optional. The plugin also takes the app-wide options:

```ts
import { OusiUIPlugin } from '@ousi-ui/vue'

app.use(OusiUIPlugin, {
  prefix: 'O',            // component prefix, default 'O'
  locale: 'en-US',        // built-in texts exist for English and Spanish
  hour12: undefined,
  firstDayOfWeek: undefined,
  dir: 'ltr',             // or 'rtl'
  backdrop: 'opaque',     // overlay backdrop style
  autoSelectSingle: false,// a required select with one option picks it
  messages: {},           // overrides for the built-in component texts
})
```

In Nuxt, register the plugin from a file in `plugins/`:

```ts
// plugins/ousi-ui.ts
import { OusiUIPlugin } from '@ousi-ui/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(OusiUIPlugin)
})
```

## Rules to follow when writing code with it

1. Every component is a named export of `@ousi-ui/vue` and starts with `O`: `OButton`, `OInput`, `OSelect`, `ODatePicker`, `OBarChart`. Parts of a compound component share the prefix (`OCard`, `OCardHeader`, `ODialog`, `ODialogBody`). The import line of each component reference lists everything it exports.
2. Do not invent props, variants, sizes or colors. They differ per component: `OButton` has `variant="primary" | "secondary" | "outline" | "text" | "link" | "soft" | "danger" | "danger-soft"`, while `OInput` has `variant="primary" | "secondary"`. If a prop is not in the component reference, it does not exist.
3. Style with the `class` prop. It is merged with the component's own classes through tailwind-merge, so your utilities win over conflicting defaults.
4. Use the token utilities instead of raw colors: `bg-ousi-surface`, `text-ousi-foreground`, `text-ousi-muted`, `border-ousi-border`, `bg-ousi-accent`, `rounded-ousi-xl`, `shadow-ousi-lg`. Never hard-code hex values for interface chrome. The accent color is the `--ousi-accent` variable, so changing it recolors everything.
5. Inputs follow one state pattern: controlled with `v-model` (`modelValue`, events `update:modelValue` and `change`) or uncontrolled with `default-value`. Check the reference for the value type, which is not always a string.
6. Dark mode is a `.dark` class or a `data-theme="dark"` attribute on any ancestor. The tokens inside it switch, so a single card can be dark on a light page.
7. Keyboard support and ARIA attributes are built in. Do not add roles or key handlers on top. Give fields a `label` instead of a separate unlinked `<label>`.
8. The built-in texts of components (month names, "Select...", "Search...") come from the `locale` and `messages` options of the plugin. A few components also have their own text props, such as `prevLabel` on `OPagination`; they are listed in the reference.
9. Charts need no charting library. They take plain data arrays plus `series` or `segments` props, and most accept `animated` and `focused` (`v-model:focused`).
10. Components that open a popover or dialog render it in a portal on `<body>`, so they cannot be shown open inside a layout. To build an inline version, compose the parts (for example `OCalendar`, or `OColorArea` with `OColorSlider`).

## Known quirks

These come from reading the source, and they are the usual reasons generated code looks wrong:

- `OButton` with `loading` hides its content (opacity 0) and shows a spinner on top, so the label disappears. To keep the label visible while busy, put an `OSpinner` in the `start` slot and do not set `loading`.
- `OColorSwatch` paints itself with inline `background` and `box-shadow`. Ring or shadow utility classes have no effect on it: draw the ring on a wrapper.
- `OColorArea` is `max-w-56` and square by default. To make it a full-width strip pass `max-w-none` and a height class.
- `OChart` is a live chart whose time axis follows the clock, so it needs points arriving continuously. It does not read `prefers-reduced-motion`; show a static chart such as `OAreaChart` to people who ask for less motion.
- `OMarquee` moves its track by half of its height or width. With `gap` above 0 the loop is off by half the gap at every wrap: use `:gap="0"` and put the spacing inside the repeated content. It does not read `prefers-reduced-motion` either.
