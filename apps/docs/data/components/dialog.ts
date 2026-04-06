import type { ComponentData } from './types'

export const dialogData: ComponentData = {
  title: 'Dialog',
  description: 'A modal overlay that focuses user attention on a specific task.',
  category: 'Overlays',
  importCode: "import { ODialog } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DialogUsage',
        code: `<OButton @click="open = true">Open Dialog</OButton>
<ODialog v-model="open">
  <ODialog.Header>Title</ODialog.Header>
  <ODialog.Body>Dialog content here.</ODialog.Body>
  <ODialog.Footer>
    <OButton @click="open = false">Close</OButton>
  </ODialog.Footer>
</ODialog>`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'DialogSizes',
        code: `<ODialog v-model="open" size="sm">...</ODialog>
<ODialog v-model="open" size="lg">...</ODialog>
<ODialog v-model="open" size="full">...</ODialog>`,
      },
    },
    {
      id: 'placements',
      title: 'Placements',
      example: {
        component: 'DialogPlacements',
        code: `<ODialog v-model="open" placement="top">...</ODialog>
<ODialog v-model="open" placement="center">...</ODialog>
<ODialog v-model="open" placement="bottom">...</ODialog>`,
      },
    },
    {
      id: 'scrollable',
      title: 'Scrollable',
      example: {
        component: 'DialogScrollable',
        code: `<ODialog v-model="open" scroll-behavior="inside">
  <ODialog.Header>Scrollable Content</ODialog.Header>
  <ODialog.Body>Long content here...</ODialog.Body>
</ODialog>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'DialogControlled',
        code: `<ODialog v-model="isOpen" @open="onOpen" @close="onClose">
  <ODialog.Header>Controlled Dialog</ODialog.Header>
  <ODialog.Body>Events fire on open/close.</ODialog.Body>
</ODialog>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'boolean', description: 'Controls open/close state (v-model).' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'cover' | 'full'", default: "'md'", description: 'Size of the dialog panel.' },
    { name: 'placement', type: "'auto' | 'top' | 'center' | 'bottom'", default: "'auto'", description: 'Vertical placement of the dialog.' },
    { name: 'backdrop', type: "'opaque' | 'blur' | 'transparent'", default: "'opaque'", description: 'Backdrop style.' },
    { name: 'scrollBehavior', type: "'inside' | 'outside'", default: "'outside'", description: 'How the body scrolls when content overflows.' },
    { name: 'hideCloseButton', type: 'boolean', default: 'false', description: 'Hide the built-in close button.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the dialog panel.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Dialog content (use Dialog.Header, Dialog.Body, Dialog.Footer).' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: boolean]', description: 'Emitted when open state changes.' },
    { name: 'open', type: '[]', description: 'Emitted when the dialog opens.' },
    { name: 'close', type: '[]', description: 'Emitted when the dialog closes.' },
  ],

  keyboard: [
    { key: 'escape', description: 'Closes the dialog.' },
    { key: 'tab', description: 'Cycles focus within the dialog (focus trap).' },
  ],

  aria: [
    { attribute: 'role="dialog"', condition: 'always', description: 'Dialog has the dialog role.' },
    { attribute: 'aria-modal="true"', condition: 'always', description: 'Indicates the dialog is modal.' },
    { attribute: 'aria-labelledby', condition: 'when header present', description: 'Labels the dialog with the header.' },
  ],

  bestPractices: [
    { text: 'Always provide a clear way to dismiss the dialog.', good: true },
    { text: 'Use scroll-behavior="inside" for long content to keep the footer visible.', good: true },
    { text: "Don't stack multiple dialogs — consider a different UX pattern.", good: false },
  ],

  haptics: {
    defaultPreset: "'medium'",
    trigger: 'On open only (not on close)',
    notes: 'Provides a noticeable bump when a modal appears.',
  },
}
