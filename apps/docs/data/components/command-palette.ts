import type { ComponentData } from './types'

export const commandPaletteData: ComponentData = {
  title: 'CommandPalette',
  description: 'A structured command menu with grouped items, keyboard navigation, shortcut badges, and built-in search filtering. Ideal for executing actions and navigating — like VS Code\'s command palette or Linear\'s Cmd+K.',
  category: 'Overlays',
  importCode: "import { OCommandPalette } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'CommandPaletteBasic',
        code: `<script setup lang="ts">
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
</template>`,
      },
    },
    {
      id: 'groups',
      title: 'Groups',
      example: {
        component: 'CommandPaletteBasic',
        code: `<OCommandPalette
  v-model="open"
  :items="items"
  placeholder="Search commands..."
  @select="onSelect"
/>`,
      },
    },
    {
      id: 'shortcuts',
      title: 'Shortcuts',
      example: {
        component: 'CommandPaletteBasic',
        code: `<!-- Items can include a shortcut property displayed on the right -->
<OCommandPalette
  v-model="open"
  :items="[
    { id: 'home', label: 'Home', shortcut: '⌘H' },
    { id: 'settings', label: 'Settings', shortcut: '⌘,' },
  ]"
  @select="onSelect"
/>`,
      },
    },
  ],

  props: [
    { name: 'items', type: 'CommandItem[]', default: '[]', description: 'Array of command items to display.' },
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Controls whether the palette is open.' },
    { name: 'placeholder', type: 'string', default: "'Search...'", description: 'Placeholder text for the search input.' },
    { name: 'emptyText', type: 'string', default: "'No results'", description: 'Text shown when no items match the search query.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '(value: boolean) => void', description: 'Fired when the open state changes.' },
    { name: 'select', type: '(key: string, item: CommandItem) => void', description: 'Fired when a command item is selected, with the item key and full item.' },
  ],

  bestPractices: [
    { text: 'Provide keyboard shortcuts for common actions.', good: true },
    { text: 'Use clear, concise labels for command items.', good: true },
    { text: 'Group related commands together for easier discovery.', good: true },
    { text: 'Avoid overloading the palette with too many items.', good: false },
  ],
}
