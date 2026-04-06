import type { ComponentData } from './types'

export const timelineNavData: ComponentData = {
  title: 'TimelineNav',
  description: 'An animated sidebar navigation with SVG curved line, gradient highlight, and glossy active marker.',
  category: 'Data Display',
  importCode: "import { OTimelineNav } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TimelineNavBasic',
        code: `<script setup>
import { ref } from 'vue'
const active = ref('button')

const sections = [
  {
    title: 'Getting Started',
    items: [
      { key: 'intro', label: 'Introduction' },
      { key: 'install', label: 'Installation' },
    ],
  },
  {
    title: 'Components',
    items: [
      { key: 'button', label: 'Button' },
      { key: 'input', label: 'Input' },
      { key: 'chart', label: 'Chart' },
    ],
  },
]
</script>

<OTimelineNav v-model="active" :sections="sections" />`,
      },
    },
    {
      id: 'with-badges',
      title: 'With Badges',
      example: {
        component: 'TimelineNavWithBadges',
        code: `<!-- Items with badge are disabled (non-interactive) -->
<OTimelineNav
  v-model="active"
  :sections="[{
    title: 'Feedback',
    items: [
      { key: 'toast', label: 'Toast' },
      { key: 'confetti', label: 'Confetti', badge: 'New' },
      { key: 'haptics', label: 'Haptics', badge: 'Soon' },
    ],
  }]"
/>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string', description: 'Active item key (v-model).' },
    { name: 'defaultValue', type: 'string', description: 'Default active key when uncontrolled.' },
    { name: 'sections', type: 'TimelineNavSection[]', description: 'Array of { title, items: [{ key, label, badge? }] }.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'header', type: '{ title: string }', description: 'Custom content for section headers.' },
    { name: 'item', type: '{ item: TimelineNavItem, active: boolean }', description: 'Custom content for nav items.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[key: string]', description: 'Emitted when the active item changes.' },
    { name: 'select', type: '[key: string]', description: 'Emitted when an item is clicked.' },
  ],

  keyboard: [
    { key: 'enter', description: 'Select the focused item.' },
    { key: 'space', description: 'Select the focused item.' },
    { key: 'tab', description: 'Move focus between items.' },
  ],

  aria: [
    { attribute: 'role="navigation"', condition: 'always', description: 'Container is a navigation landmark.' },
    { attribute: 'role="button"', condition: 'each item', description: 'Items are interactive buttons.' },
    { attribute: 'aria-current="page"', condition: 'active item', description: 'Marks the currently active item.' },
  ],

  bestPractices: [
    { text: 'Use for sidebar navigation with grouped sections.', good: true },
    { text: 'Use the `@select` event to handle routing (e.g. `router.push`).', good: true },
    { text: 'Use `badge` to mark upcoming or new items without making them interactive.', good: true },
    { text: "Don't use for more than ~50 items — the SVG line gets very tall.", good: false },
  ],
}
