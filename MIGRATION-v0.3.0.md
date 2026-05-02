# Ousi UI — Migration Prompt: v0.1.x → v0.3.0

> Copy this entire file as a prompt to your AI coding agent (Claude Code, Cursor,
> etc.) and point it at the project that consumes `@ousi-ui/vue`. The agent
> should perform every transformation listed below and report anything it could
> not auto-resolve.

---

## Context for the agent

You are migrating a Vue 3 codebase from **`@ousi-ui/vue@0.1.x`** to
**`@ousi-ui/vue@0.3.0`**. There are **three breaking changes**. Apply them in
order, project-wide. Treat `.vue`, `.ts`, `.tsx`, `.js`, `.jsx`, and `.md` files
as candidates. Skip `node_modules`, `dist`, `.nuxt`, `.output`, build caches,
and any compiled bundle (`*.min.js`, `dist/**/*.js`).

After applying changes:

1. Run the project's typecheck (`vue-tsc --noEmit` or equivalent) and fix any
   residual errors.
2. Run the project's lint (`eslint`, `oxlint`, etc.) and fix import order if the
   linter complains.
3. If the project is published, bump its peerDependency on `@ousi-ui/vue`
   to `^0.3.0` in `package.json`.

Do **not** change unrelated code. Do **not** introduce new dependencies. Do
**not** create commits — leave changes staged for the human to review.

---

## Change 1 — `variant="ghost"` → `variant="text"`

The `ghost` variant was renamed to `text` on three components to align with
standard naming.

**Affected components:** `OButton`, `OChip`, and the `action.variant` field in
`OToast` options.

### Find / replace patterns

Apply these as case-sensitive replacements:

| Find | Replace |
|------|---------|
| `variant="ghost"` | `variant="text"` |
| `variant='ghost'` | `variant='text'` |
| `:variant="'ghost'"` | `:variant="'text'"` |
| `'ghost'` (only inside arrays/objects of `OButton` / `OChip` / toast variants) | `'text'` |
| `"ghost"` (same scope as above) | `"text"` |
| `ButtonVariant` containing `'ghost'` in your own type narrows | `'text'` |
| `ChipVariant` containing `'ghost'` in your own type narrows | `'text'` |

### Important caveats

- If the project uses `'ghost'` as a string for **any other purpose** (a state
  machine, a theme name, etc.), do **not** rename it. Only rename when the value
  is bound to a `variant` prop on `OButton`/`OChip`, or to the `variant` field
  inside an `OToast` action.
- If you pass `variant` dynamically (`:variant="someExpression"`), check the
  source variable's type and rename `'ghost'` there.
- Visible UI labels (`<OButton variant="text">Ghost</OButton>` text contents
  like `Ghost`) should stay unchanged unless they were specifically labelling
  the variant. Leave UI copy alone.

### Example

```vue
<!-- Before -->
<OButton variant="ghost">Cancel</OButton>
<OChip variant="ghost" color="default">Beta</OChip>

toast({ title: 'Saved', action: { label: 'Undo', onClick: ..., variant: 'ghost' } })

<!-- After -->
<OButton variant="text">Cancel</OButton>
<OChip variant="text" color="default">Beta</OChip>

toast({ title: 'Saved', action: { label: 'Undo', onClick: ..., variant: 'text' } })
```

---

## Change 2 — Compound components flattened (no more dot-notation)

Five compound components were flattened from `OParent.Child` (Object.assign-style
sub-components) to flat `OParentChild` exports. This makes them easier to
auto-import, lint, and tree-shake.

### Affected components and their new flat names

**Card** (`OCard.X` → `OCardX`):

- `OCard.Header` → `OCardHeader`
- `OCard.Title` → `OCardTitle`
- `OCard.Description` → `OCardDescription`
- `OCard.Content` → `OCardContent`
- `OCard.Footer` → `OCardFooter`

**Dialog** (`ODialog.X` → `ODialogX`):

- `ODialog.Header` → `ODialogHeader`
- `ODialog.Body` → `ODialogBody`
- `ODialog.Footer` → `ODialogFooter`

**Dropdown** (`ODropdown.X` → `ODropdownX`):

- `ODropdown.Trigger` → `ODropdownTrigger`
- `ODropdown.Popover` → `ODropdownPopover`
- `ODropdown.Menu` → `ODropdownMenu`
- `ODropdown.Item` → `ODropdownItem`
- `ODropdown.ItemIndicator` → `ODropdownItemIndicator`
- `ODropdown.Section` → `ODropdownSection`
- `ODropdown.SubmenuTrigger` → `ODropdownSubmenuTrigger`
- `ODropdown.SubmenuIndicator` → `ODropdownSubmenuIndicator`
- `ODropdown.Separator` → `ODropdownSeparator`

**ButtonGroup** (`OButtonGroup.X` → `OButtonGroupX`):

- `OButtonGroup.Separator` → `OButtonGroupSeparator`

**BentoGrid** (`OBentoGrid.X` → `OBentoGridX`):

- `OBentoGrid.Item` → `OBentoGridItem`

### What to change

Three places per usage site:

1. **The import statement** — add the flat sub-components alongside the parent:

   ```ts
   // Before
   import { OCard } from '@ousi-ui/vue'

   // After
   import { OCard, OCardHeader, OCardTitle, OCardContent, OCardFooter } from '@ousi-ui/vue'
   ```

   Only import the sub-components actually used in the file.

2. **The template** — rewrite each dot-notation tag:

   ```vue
   <!-- Before -->
   <OCard>
     <OCard.Header>
       <OCard.Title>Plan</OCard.Title>
     </OCard.Header>
     <OCard.Content>...</OCard.Content>
     <OCard.Footer>...</OCard.Footer>
   </OCard>

   <!-- After -->
   <OCard>
     <OCardHeader>
       <OCardTitle>Plan</OCardTitle>
     </OCardHeader>
     <OCardContent>...</OCardContent>
     <OCardFooter>...</OCardFooter>
   </OCard>
   ```

3. **JSX/TSX usage** (if the project uses render functions or JSX) — rewrite
   `<OCard.Header>` → `<OCardHeader>` the same way.

### Important caveats

- Don't rewrite the parent. `OCard`, `ODialog`, `ODropdown`, `OButtonGroup`,
  and `OBentoGrid` keep their names.
- If a project uses dynamic `<component :is="...">` and references `OCard.Header`
  via a variable, switch the variable to the flat name.
- Auto-import projects (Nuxt, `unplugin-vue-components`) need no manual import
  changes — just rewrite the templates. The flat names auto-resolve.
- If the project also uses `@ousi-ui/nuxt`, no config changes are required.

---

## Change 3 — `fullWidth` removed from all field components

Field components now always stretch to fill their parent. The `fullWidth` /
`full-width` prop has been removed from all of them. To constrain width, wrap
the field in a sized container.

### Affected components

`OInput`, `OTextarea`, `OSelect`, `OAutocomplete`, `ONumberField`, `OColorField`,
`ODateField`, `OTimeField`, `ODatePicker`, `ODateRangePicker`, `OInputOtp`,
`OTagInput`, `OCheckbox` (and any other field component the project uses).

The `fullWidth` prop **remains** on `OButton` and `OButtonGroup` — those are not
fields and the prop still has meaning there. Don't touch them.

### Find / replace patterns

| Find | Replace |
|------|---------|
| `<OInput full-width ...>` | `<OInput ...>` (remove `full-width`) |
| `<OInput :full-width="true" ...>` | `<OInput ...>` |
| `<OInput :full-width="false" ...>` | `<OInput ...>` (default behavior is full-width) |
| `<OInput v-bind="{ fullWidth: true, ... }" />` | strip `fullWidth` from the binding |

Apply the same pattern to every field component listed above.

### Important caveats

- If the project relied on `fullWidth: false` to keep a field at intrinsic
  width, **wrap the field** in a container with the desired width:

  ```vue
  <!-- Before — field would render at intrinsic width -->
  <OInput :full-width="false" placeholder="Search" />

  <!-- After — wrap to constrain -->
  <div class="w-64">
    <OInput placeholder="Search" />
  </div>
  ```

- Do **not** remove `full-width` from `<OButton>` or `<OButtonGroup>` —
  those still accept the prop.

---

## Verification checklist (run after applying all changes)

- [ ] No remaining `variant="ghost"` / `'ghost'` strings tied to OButton/OChip/OToast.
- [ ] No remaining `OCard.`, `ODialog.`, `ODropdown.`, `OButtonGroup.Separator`,
      or `OBentoGrid.Item` dot-notation in templates or JSX.
- [ ] No remaining `full-width` / `fullWidth` props on field components (Button
      and ButtonGroup are allowed to keep theirs).
- [ ] Project typechecks cleanly (`vue-tsc --noEmit` or equivalent).
- [ ] Project lints cleanly.
- [ ] `package.json` has `"@ousi-ui/vue": "^0.3.0"` (and any related
      `@ousi-ui/*` packages bumped to `^0.3.0`).
- [ ] Visual smoke test of any page that uses the migrated components — fields
      render full-width, buttons styled with `text` look right, dropdowns and
      cards still compose correctly.

---

## What did NOT change (do not touch)

- All other props (`size`, `shadow`, `animated`, `disabled`, `loading`,
  `clearable`, etc.) keep the same names and values.
- The `OButton` and `OChip` variants `primary`, `secondary`, `outline`, `soft`,
  `danger`, and `danger-soft` are unchanged.
- The CSS theme tokens (`--ousi-accent`, `--ousi-radius`, etc.) are unchanged.
  Brand defaults shifted (accent now `#1b5cff`, success `#46c93a`, warning
  `#ffba00`, danger `#ff4757`), but they read from CSS custom properties — if
  the project overrides them, those overrides still work.
- Component event names (`update:modelValue`, `change`, `clear`, etc.) are
  unchanged.

If you find code that doesn't match any of the patterns above but seems
related, leave it alone and flag it for human review.
