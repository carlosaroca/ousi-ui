---
title: Button
description: A clickable button component with multiple variants and states.
---

# Button

A versatile button component that supports multiple visual variants, sizes, loading states, and icon-only modes.

## Import

```typescript
import { OButton } from '@ousi-ui/vue'
```

## Usage

```vue
<OButton>Default button</OButton>
```

## Variants

The `variant` prop controls the visual style of the button.

```vue
<OButton variant="primary">Primary</OButton>
<OButton variant="secondary">Secondary</OButton>
<OButton variant="outline">Outline</OButton>
<OButton variant="ghost">Ghost</OButton>
<OButton variant="soft">Soft</OButton>
<OButton variant="danger">Danger</OButton>
<OButton variant="danger-soft">Danger Soft</OButton>
```

## Sizes

Three sizes are available via the `size` prop.

```vue
<OButton size="sm">Small</OButton>
<OButton size="md">Medium</OButton>
<OButton size="lg">Large</OButton>
```

## States

### Loading

```vue
<OButton loading>Saving...</OButton>
```

### Disabled

```vue
<OButton disabled>Disabled</OButton>
```

### Full width

```vue
<OButton full-width>Full Width</OButton>
```

## With icons

Use the `start` and `end` slots to add icons.

```vue
<OButton>
  <template #start>
    <PlusIcon class="w-4 h-4" />
  </template>
  Add item
</OButton>
```

### Icon only

```vue
<OButton is-icon-only variant="ghost">
  <SettingsIcon class="w-4 h-4" />
</OButton>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'soft' \| 'danger' \| 'danger-soft'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable interactions |
| `loading` | `boolean` | `false` | Show loading state |
| `isIconOnly` | `boolean` | `false` | Icon-only mode (square) |
| `fullWidth` | `boolean` | `false` | Stretch to container width |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `as` | `string \| Component` | `'button'` | Render as a different element |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Button label |
| `start` | Content before the label |
| `end` | Content after the label |
| `loading` | Custom loading indicator |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted on click |
