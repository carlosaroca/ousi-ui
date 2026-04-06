<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

const items = [
  { label: 'Home', key: 'home', group: 'Navigation', shortcut: '⌘H' },
  { label: 'Settings', key: 'settings', group: 'Navigation', shortcut: '⌘,' },
  { label: 'Profile', key: 'profile', group: 'Navigation' },
  { label: 'New Project', key: 'new', group: 'Actions', shortcut: '⌘N' },
  { label: 'Import Data', key: 'import', group: 'Actions' },
  { label: 'Export PDF', key: 'export', group: 'Actions' },
  { label: 'Toggle Theme', key: 'theme', group: 'Preferences', shortcut: '⌘⇧T' },
  { label: 'Sign Out', key: 'signout', group: 'Account' },
]

function onSelect(key: string) {
  console.log('Selected:', key)
  open.value = false
}
</script>

<template>
  <div>
    <OButton @click="open = true" variant="flat" size="sm">
      Open Command Palette
      <OKbd class="ml-2">⌘K</OKbd>
    </OButton>
    <OCommandPalette v-model="open" :items="items" placeholder="Type a command..." @select="onSelect" />
  </div>
</template>
