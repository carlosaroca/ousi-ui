import type { ComponentData } from './types'

export const dockData: ComponentData = {
  title: 'Dock',
  description: 'macOS-style dock with icon magnification on hover.',
  category: 'Interactive',
  importCode: "import { ODock } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DockBasic',
        code: `<script setup lang="ts">
const items = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'files', icon: '📁', label: 'Files' },
  { id: 'search', icon: '🔍', label: 'Search' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
  { id: 'mail', icon: '📧', label: 'Mail' },
  { id: 'music', icon: '🎵', label: 'Music' },
]
</script>

<ODock :items="items" @select="(item) => console.log(item)" />`,
      },
    },
    {
      id: 'custom-size',
      title: 'Custom Size',
      example: {
        component: 'DockCustom',
        code: `<ODock
  :items="items"
  :magnification="48"
  :base-size="56"
  :distance="120"
  @select="(item) => console.log(item)"
/>`,
      },
    },
  ],

  props: [
    { name: 'items', type: 'DockItem[]', default: '[]', description: 'Array of dock items. Each item has id, icon, and label properties.' },
    { name: 'magnification', type: 'number', default: '28', description: 'Extra size in pixels added to icons on hover magnification.' },
    { name: 'distance', type: 'number', default: '100', description: 'Mouse distance threshold in pixels for the magnification effect.' },
    { name: 'baseSize', type: 'number', default: '40', description: 'Base size of each dock icon in pixels.' },
  ],

  emits: [
    { name: 'select', type: '(item: DockItem) => void', description: 'Emitted when a dock item is clicked.' },
  ],
}
