<script setup lang="ts">
const items = [
  { key: 'photos', label: 'Photos' },
  { key: 'videos', label: 'Videos' },
  { key: 'music', label: 'Music' },
]

const icons: Record<string, string> = {
  photos: '📷',
  videos: '🎬',
  music: '🎵',
}
</script>

<template>
  <OTabs :items="items">
    <template #tab="{ item }">
      <span class="flex items-center gap-1.5">
        <span class="text-xs">{{ icons[item.key] }}</span>
        <span>{{ item.label }}</span>
      </span>
    </template>
    <template #photos>
      <p class="text-sm text-ousi-muted">Your photo library.</p>
    </template>
    <template #videos>
      <p class="text-sm text-ousi-muted">Your video collection.</p>
    </template>
    <template #music>
      <p class="text-sm text-ousi-muted">Your music playlists.</p>
    </template>
  </OTabs>
</template>
