---
title: Input
description: A text input component with labels, descriptions, validation, and icon slots.
---

# Input

A fully-featured text input with built-in label, description, error messages, and clearable support.

## Import

```typescript
import { OInput } from '@ousi-ui/vue'
```

## Usage

```vue
<OInput v-model="value" placeholder="Enter text..." />
```

## With label and description

```vue
<OInput
  v-model="email"
  label="Email"
  description="We'll never share your email."
  placeholder="you@example.com"
  type="email"
/>
```

## Variants

```vue
<OInput variant="primary" placeholder="Primary" />
<OInput variant="secondary" placeholder="Secondary" />
```

## Sizes

```vue
<OInput size="sm" placeholder="Small" />
<OInput size="md" placeholder="Medium" />
<OInput size="lg" placeholder="Large" />
```

## States

### Error

```vue
<OInput
  v-model="email"
  label="Email"
  error-message="Please enter a valid email."
/>
```

### Disabled

```vue
<OInput disabled placeholder="Disabled" />
```

### Read-only

```vue
<OInput readonly model-value="Read only value" />
```

### Clearable

```vue
<OInput v-model="query" clearable placeholder="Search..." />
```

### Loading

```vue
<OInput loading placeholder="Loading..." />
```

## With icons

```vue
<OInput placeholder="Search...">
  <template #start>
    <SearchIcon class="w-4 h-4" />
  </template>
</OInput>

<OInput placeholder="Amount">
  <template #end>
    <span class="text-ousi-muted text-sm">USD</span>
  </template>
</OInput>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | — | Bound value (v-model) |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` | Input type |
| `placeholder` | `string` | — | Placeholder text |
| `label` | `string` | — | Label text |
| `description` | `string` | — | Helper text below the input |
| `errorMessage` | `string` | — | Error message (activates error state) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Visual style |
| `disabled` | `boolean` | `false` | Disable the input |
| `readonly` | `boolean` | `false` | Make read-only |
| `required` | `boolean` | `false` | Mark as required |
| `clearable` | `boolean` | `false` | Show clear button |
| `loading` | `boolean` | `false` | Show loading state |
| `fullWidth` | `boolean` | `false` | Stretch to container width |

### Slots

| Slot | Description |
|------|-------------|
| `start` | Content before the input (e.g. icon) |
| `end` | Content after the input (e.g. unit label) |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Value changed |
| `change` | `Event` | Native change event |
| `focus` | `FocusEvent` | Input focused |
| `blur` | `FocusEvent` | Input blurred |
| `clear` | — | Clear button clicked |
