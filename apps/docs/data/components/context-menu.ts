import type { ComponentData } from './types'

export const contextMenuData: ComponentData = {
  title: 'ContextMenu',
  description: 'A menu triggered by right-clicking on an element — supports nested submenus, toggle items, section headings, custom icons, and an imperative show() API.',
  category: 'Overlays',
  importCode: "import { OContextMenu } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ContextMenuBasic',
        code: `<script setup lang="ts">
import { OContextMenu } from '@ousi-ui/vue'
import type { ContextMenuItem } from '@ousi-ui/vue'

const items: ContextMenuItem[] = [
  { key: 'copy', label: 'Copy', shortcut: '⌘C' },
  { key: 'paste', label: 'Paste', shortcut: '⌘V' },
  { separator: true },
  { key: 'delete', label: 'Delete', danger: true },
]
&lt;/script&gt;

<template>
  <OContextMenu :items="items">
    <div>Right-click here</div>
  </OContextMenu>
</template>`,
      },
    },
    {
      id: 'submenu',
      title: 'Nested submenus',
      example: {
        component: 'ContextMenuSubmenu',
        code: `const items: ContextMenuItem[] = [
  { key: 'new',  label: 'New',     shortcut: '⌘N' },
  { key: 'open', label: 'Open…',   shortcut: '⌘O' },
  { separator: true },
  {
    key: 'export',
    label: 'Export as',
    children: [
      { key: 'csv',  label: 'CSV', shortcut: '⌘E' },
      { key: 'xlsx', label: 'Excel' },
      { key: 'pdf',  label: 'PDF' },
    ],
  },
  { separator: true },
  { key: 'delete', label: 'Delete', danger: true, shortcut: '⌫' },
]`,
      },
    },
    {
      id: 'submenu-offset',
      title: 'Submenu offset',
      example: {
        component: 'ContextMenuOffset',
        code: `// Pixel gap between a parent item and its open submenu.
<OContextMenu :items="items" :submenu-offset="0" />
<OContextMenu :items="items" :submenu-offset="4" />  <!-- default -->
<OContextMenu :items="items" :submenu-offset="16" />`,
      },
    },
    {
      id: 'imperative',
      title: 'Imperative show() — open programmatically',
      example: {
        component: 'ContextMenuImperative',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { OContextMenu } from '@ousi-ui/vue'

const menuRef = ref<InstanceType<typeof OContextMenu>>()

// Open anchored to the clicked element (use event.currentTarget — works with
// any component without needing a template ref to the DOM node):
function openAtButton(e: MouseEvent) {
  const btn = e.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  menuRef.value?.show({ x: rect.left, y: rect.bottom + 4 })
}

// Or open at the cursor position:
function openAtCursor(e: MouseEvent) {
  menuRef.value?.show(e)
}
&lt;/script&gt;

<template>
  <OButton @click="openAtButton">Open menu below</OButton>
  <OButton @click="openAtCursor">Open at cursor</OButton>

  <!-- No trigger slot needed — the menu opens via the ref. -->
  <OContextMenu ref="menuRef" :items="items" />
</template>`,
      },
    },
    {
      id: 'keep-open',
      title: 'keepOpen — toggle items',
      example: {
        component: 'ContextMenuKeepOpen',
        code: `// Items with \`keepOpen: true\` don't close the menu when clicked —
// useful for column visibility toggles, switches, etc.
const items: ContextMenuItem[] = [
  { key: 'columns', label: 'Columns', heading: true },
  { key: 'name',   label: '✓ Name',   keepOpen: true },
  { key: 'email',  label: '✓ Email',  keepOpen: true },
  { key: 'status', label: '  Status', keepOpen: true },
  { separator: true },
  { key: 'reset', label: 'Reset to defaults' },
]`,
      },
    },
    {
      id: 'headings',
      title: 'Section headings',
      example: {
        component: 'ContextMenuHeadings',
        code: `// Items with \`heading: true\` render as uppercase muted section labels —
// non-interactive and skipped in keyboard navigation.
const items: ContextMenuItem[] = [
  { key: 'edit', label: 'Edit', heading: true },
  { key: 'cut',  label: 'Cut',   shortcut: '⌘X' },
  { key: 'copy', label: 'Copy',  shortcut: '⌘C' },

  { key: 'view', label: 'View', heading: true },
  { key: 'zoom-in',  label: 'Zoom in',  shortcut: '⌘+' },
  { key: 'zoom-out', label: 'Zoom out', shortcut: '⌘-' },
]`,
      },
    },
    {
      id: 'custom-icons',
      title: 'Custom icons',
      example: {
        component: 'ContextMenuCustomIcons',
        code: `// \`icon\` accepts a Vue component — pass any icon library (Hugeicons, Lucide, etc.):
import { CopyIcon, ShareIcon, TrashIcon } from 'your-icon-library'

const items: ContextMenuItem[] = [
  { key: 'copy',   label: 'Copy',   icon: CopyIcon,  shortcut: '⌘C' },
  { key: 'share',  label: 'Share',  icon: ShareIcon },
  { separator: true },
  { key: 'delete', label: 'Delete', icon: TrashIcon, danger: true },
]

// For full control over icon rendering (e.g. Hugeicons array format), use the slot:
<OContextMenu :items="items">
  <template #icon="{ item }">
    <HugeiconsIcon v-if="item.iconData" :icon="item.iconData" class="size-4" />
  </template>
</OContextMenu>`,
      },
    },
  ],

  props: [
    { name: 'items', type: 'ContextMenuItem[]', default: '[]', description: 'Array of menu items.' },
    { name: 'shadow', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'lg'", description: 'Elevation shadow.' },
    { name: 'submenuOffset', type: 'number', default: '4', description: 'Pixel gap between a parent item and its open submenu.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable right-click activation on the trigger slot.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the menu surface.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Right-click target. Wrap any content to make it the trigger.' },
    { name: 'icon', type: 'slot', description: 'Per-item icon renderer. Receives `{ item }`. Use this for custom icon libraries (Hugeicons array format, etc.). Falls back to the `icon` field on the item.' },
  ],

  emits: [
    { name: 'select', type: '(key: string, item: ContextMenuItem) => void', description: 'Fired when a leaf item is selected.' },
    { name: 'open', type: '() => void', description: 'Fired when the menu opens.' },
    { name: 'close', type: '() => void', description: 'Fired when the menu closes.' },
  ],

  methods: [
    { name: 'show', type: '(input?: MouseEvent | { x: number; y: number }) => void', description: 'Open the menu programmatically. Accepts a MouseEvent (uses clientX/Y) or absolute coordinates.' },
    { name: 'hide', type: '() => void', description: 'Close the menu programmatically.' },
    { name: 'isOpen', type: 'Ref<boolean>', description: 'Reactive open state.' },
  ],

  keyboard: [
    { key: 'arrow-down / arrow-up', description: 'Move focus to the next / previous selectable item (skips separators, headings, and disabled items).' },
    { key: 'arrow-right', description: 'Open the submenu of the focused item.' },
    { key: 'arrow-left', description: 'Close the current submenu (only in submenus).' },
    { key: 'home / end', description: 'Move focus to the first / last selectable item.' },
    { key: 'enter / space', description: 'Activate the focused item (selects it or opens its submenu).' },
    { key: 'escape', description: 'Close the current menu level. Pressing again closes the parent.' },
  ],

  aria: [
    { attribute: 'role="menu"', condition: 'each level', description: 'Each menu surface (root or submenu) has the menu role.' },
    { attribute: 'role="menuitem"', condition: 'each item', description: 'Selectable items are menu items.' },
    { attribute: 'aria-haspopup="menu"', condition: 'items with children', description: 'Indicates the item opens a submenu.' },
    { attribute: 'aria-expanded', condition: 'items with children', description: 'Reflects whether the submenu is open.' },
    { attribute: 'aria-disabled', condition: 'disabled items', description: 'Marks the item as non-interactive.' },
    { attribute: 'role="separator"', condition: 'separator items', description: 'Horizontal divider between groups.' },
  ],

  bestPractices: [
    { text: 'Use `heading` to group related actions instead of relying only on separators.', good: true },
    { text: 'Put destructive actions at the bottom with `danger: true`.', good: true },
    { text: 'Use `keepOpen` for toggles (column visibility, switches) so the user can toggle several at once.', good: true },
    { text: "Don't nest submenus more than 2 levels deep — discoverability drops fast.", good: false },
    { text: "Don't rely solely on context menus for important actions — always provide a visible alternative.", good: false },
  ],
}
