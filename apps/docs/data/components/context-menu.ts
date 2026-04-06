import type { ComponentData } from './types'

export const contextMenuData: ComponentData = {
  title: 'ContextMenu',
  description: 'A menu triggered by right-clicking on an element.',
  category: 'Overlays',
  importCode: "import { OContextMenu } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ContextMenuBasic',
        code: `<OContextMenu :items="[
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete' },
]" @select="onSelect">
  <div class="p-8 border border-dashed rounded-lg text-center">
    Right-click here
  </div>
</OContextMenu>`,
      },
    },
    {
      id: 'shortcuts',
      title: 'With Shortcuts',
      example: {
        component: 'ContextMenuBasic',
        code: `<OContextMenu :items="[
  { id: 'copy', label: 'Copy', shortcut: '⌘C' },
  { id: 'paste', label: 'Paste', shortcut: '⌘V' },
  { id: 'delete', label: 'Delete', shortcut: '⌫' },
]">
  <div>Right-click here</div>
</OContextMenu>`,
      },
    },
    {
      id: 'danger-items',
      title: 'Danger Items',
      example: {
        component: 'ContextMenuBasic',
        code: `<OContextMenu :items="[
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete', variant: 'danger' },
]">
  <div>Right-click here</div>
</OContextMenu>`,
      },
    },
  ],

  props: [
    { name: 'items', type: 'ContextMenuItem[]', default: '[]', description: 'Array of menu items to display.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the context menu.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'The target area that triggers the context menu on right-click.' },
  ],

  emits: [
    { name: 'select', type: '[item: ContextMenuItem]', description: 'Emitted when a menu item is selected.' },
  ],

  keyboard: [
    { key: 'escape', description: 'Closes the context menu.' },
    { key: 'arrow-down', description: 'Moves focus to the next item.' },
    { key: 'arrow-up', description: 'Moves focus to the previous item.' },
    { key: 'enter', description: 'Activates the focused item.' },
  ],

  bestPractices: [
    { text: 'Keep context menus short and relevant to the target element.', good: true },
    { text: 'Place destructive actions at the end with danger variant.', good: true },
    { text: "Don't rely solely on context menus for important actions — provide alternatives.", good: false },
  ],
}
