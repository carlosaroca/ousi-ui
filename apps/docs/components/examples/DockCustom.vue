<script setup lang="ts">
const items = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'files', icon: '📁', label: 'Files' },
  { id: 'search', icon: '🔍', label: 'Search' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
  { id: 'mail', icon: '📧', label: 'Mail' },
  { id: 'music', icon: '🎵', label: 'Music' },
]
</script>

<template>
  <ODock
    :items="items"
    :magnification="48"
    :base-size="56"
    :distance="120"
    @select="(item) => console.log(item)"
  />
</template>
