<script setup lang="ts">
import { OTimeline, OCard, OCardContent, OChip } from '@ousi-ui/vue'
const items = [
  { key: 'design', content: 'Design System', color: 'accent' as const },
  { key: 'dev', content: 'Development', color: 'accent' as const },
  { key: 'launch', content: 'Launch', color: 'success' as const },
]
</script>
<template>
  <OTimeline :items="items">
    <template #content-design>
      <OCard class="mb-2">
        <OCardContent class="gap-1">
          <p class="text-sm font-medium text-ousi-foreground">Design System</p>
          <p class="text-xs text-ousi-muted">Created tokens, components, and documentation.</p>
          <OChip color="accent" variant="soft" size="sm">Completed</OChip>
        </OCardContent>
      </OCard>
    </template>
    <template #content-dev>
      <OCard class="mb-2">
        <OCardContent class="gap-1">
          <p class="text-sm font-medium text-ousi-foreground">Development</p>
          <p class="text-xs text-ousi-muted">Built 50+ Vue 3 components with haptics.</p>
          <OChip color="accent" variant="soft" size="sm">Completed</OChip>
        </OCardContent>
      </OCard>
    </template>
    <template #content-launch>
      <OCard class="mb-2">
        <OCardContent class="gap-1">
          <p class="text-sm font-medium text-ousi-foreground">Launch</p>
          <p class="text-xs text-ousi-muted">Published to npm and docs site.</p>
          <OChip color="success" variant="soft" size="sm">Live</OChip>
        </OCardContent>
      </OCard>
    </template>
  </OTimeline>
</template>
