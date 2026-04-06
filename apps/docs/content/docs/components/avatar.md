---
title: Avatar
description: A circular or square image component for user profiles with fallback support.
---

# Avatar

Displays a user's profile image with automatic fallback to initials or a custom fallback slot.

## Import

```typescript
import { OAvatar } from '@ousi-ui/vue'
```

## Usage

```vue
<OAvatar src="/avatar.jpg" alt="John Doe" />
```

## With name fallback

When no image is provided, initials are generated from the `name` prop.

```vue
<OAvatar name="John Doe" />
```

## Sizes

```vue
<OAvatar name="JD" size="sm" />
<OAvatar name="JD" size="md" />
<OAvatar name="JD" size="lg" />
<OAvatar name="JD" size="xl" />
```

## Shapes

```vue
<OAvatar name="JD" shape="circle" />
<OAvatar name="JD" shape="square" />
```

## Custom fallback

```vue
<OAvatar>
  <template #fallback>
    <UserIcon class="w-5 h-5" />
  </template>
</OAvatar>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Image URL |
| `alt` | `string` | `''` | Alt text |
| `name` | `string` | — | Name for initials fallback |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `shape` | `'circle' \| 'square'` | `'circle'` | Avatar shape |

### Slots

| Slot | Description |
|------|-------------|
| `fallback` | Custom fallback content when no image loads |
