import type { ComponentData } from './types'

export const popoverData: ComponentData = {
  title: 'Popover',
  description: 'A floating panel anchored to a trigger element for rich content.',
  category: 'Overlays',
  importCode: "import { OPopover } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'PopoverUsage',
        code: `<OPopover title="Help">
  <template #trigger>
    <OButton variant="outline">Open Popover</OButton>
  </template>
  <p>This is the popover content.</p>
</OPopover>`,
      },
    },
    {
      id: 'placements',
      title: 'Placements',
      example: {
        component: 'PopoverPlacements',
        code: `<OPopover placement="top">...</OPopover>
<OPopover placement="right">...</OPopover>
<OPopover placement="bottom">...</OPopover>
<OPopover placement="left">...</OPopover>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'PopoverControlled',
        code: `<OPopover ref="popoverRef" @open="onOpen" @close="onClose">
  <template #trigger>
    <OButton>Trigger</OButton>
  </template>
  <p>Content with events.</p>
</OPopover>`,
      },
    },
  ],

  props: [
    { name: 'placement', type: 'Placement', default: "'bottom'", description: 'Placement relative to the trigger.' },
    { name: 'shadow', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'lg'", description: 'Elevation shadow.' },
    { name: 'offset', type: 'number', default: '8', description: 'Offset in px from the trigger.' },
    { name: 'showArrow', type: 'boolean', default: 'false', description: 'Show an arrow pointing to the trigger.' },
    { name: 'title', type: 'string', description: 'Title shown at the top of the popover.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the panel.' },
  ],

  slots: [
    { name: 'trigger', type: '{ open: boolean, toggle: () => void }', description: 'Element that toggles the popover.' },
    { name: 'default', type: '{ close: () => void }', description: 'Popover content.' },
  ],

  emits: [
    { name: 'open', type: '[]', description: 'Emitted when the popover opens.' },
    { name: 'close', type: '[]', description: 'Emitted when the popover closes.' },
  ],

  keyboard: [
    { key: 'escape', description: 'Closes the popover.' },
    { key: 'tab', description: 'Moves focus within the popover content.' },
  ],

  aria: [
    { attribute: 'role="dialog"', condition: 'always', description: 'Popover panel has dialog role.' },
  ],

  bestPractices: [
    { text: 'Use popovers for additional context, not primary content.', good: true },
    { text: 'Keep popover content concise and focused.', good: true },
    { text: "Don't put complex forms inside popovers — use a dialog instead.", good: false },
  ],
}
