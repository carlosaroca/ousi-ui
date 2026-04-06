---
title: Badge
description: A small label component for status indicators and tags.
---

# Badge

A compact label for displaying status, categories, or counts.

## Import

```typescript
import { OBadge } from '@ousi-ui/vue'
```

## Usage

```vue
<OBadge>Default</OBadge>
```

## Variants

```vue
<OBadge variant="solid">Solid</OBadge>
<OBadge variant="outline">Outline</OBadge>
<OBadge variant="soft">Soft</OBadge>
<OBadge variant="ghost">Ghost</OBadge>
```

## Colors

```vue
<OBadge color="accent">Accent</OBadge>
<OBadge color="success">Success</OBadge>
<OBadge color="warning">Warning</OBadge>
<OBadge color="danger">Danger</OBadge>
<OBadge color="default">Default</OBadge>
```

## Sizes

```vue
<OBadge size="sm">Small</OBadge>
<OBadge size="md">Medium</OBadge>
<OBadge size="lg">Large</OBadge>
```

## With icons

```vue
<OBadge>
  <template #start>
    <CheckIcon class="w-3 h-3" />
  </template>
  Verified
</OBadge>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'solid' \| 'outline' \| 'soft' \| 'ghost'` | `'solid'` | Visual style |
| `color` | `'accent' \| 'success' \| 'warning' \| 'danger' \| 'default'` | `'accent'` | Color scheme |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Badge content |
| `start` | Content before the label |
| `end` | Content after the label |
