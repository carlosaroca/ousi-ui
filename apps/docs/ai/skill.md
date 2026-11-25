# Ousi UI

Ousi UI ({{COUNT}} Vue 3 components, Tailwind CSS v4, OKLCH tokens). Use this skill to write code that uses it correctly instead of guessing props.

## Workflow

1. Check the project is set up: `@ousi-ui/vue` and `@ousi-ui/theme` in `package.json`, and `@import "@ousi-ui/theme";` in the main stylesheet. If not, follow the setup in `references/conventions.md`.
2. Read `references/conventions.md` once. It holds the rules below in full, the token list and the known quirks.
3. Find the components you need in `references/components.md` (grouped by category, with the exact export names). The reference file of a component is `references/components/<slug>.md`, where the slug is the kebab-case name without the `O`: `OBarChart` is `bar-chart`, `ODatePicker` is `date-picker`.
4. Read the reference of every component before using it. It lists the real props with types and defaults, slots, events, keyboard behavior and working examples.
5. Write the code, then check each prop and value you used against the reference. A prop that is not listed does not exist.

## Rules that always apply

- Import named components from `@ousi-ui/vue`; they start with `O`.
- Never invent props, variants or sizes. They differ per component.
- Style through the `class` prop and the token utilities (`bg-ousi-surface`, `text-ousi-foreground`, `border-ousi-border`, `bg-ousi-accent`, `rounded-ousi-xl`). No hard-coded hex colors for interface chrome.
- Inputs are controlled with `v-model` or uncontrolled with `default-value`.
- Dark mode is a `.dark` class or `data-theme="dark"` on an ancestor.
- Keyboard and ARIA are built in. Do not add them again.
- If the references are not available, read the types in `node_modules/@ousi-ui/vue` rather than guessing, or the docs at {{SITE}}/llms-full.txt.
