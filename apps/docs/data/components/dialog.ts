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
  <ODialogHeader>Title</ODialogHeader>
  <ODialogBody>Dialog content here.</ODialogBody>
  <ODialogFooter>
    <OButton @click="open = false">Close</OButton>
  </ODialogFooter>
</ODialog>`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'DialogSizes',
        code: `<!-- size is the width: xs 20rem, sm 24rem, md 28rem, lg 32rem, xl 36rem,
     2xl 42rem, 3xl 48rem, 4xl 56rem, 5xl 64rem; never wider than the viewport. -->
<ODialog v-model="open" size="sm">...</ODialog>
<ODialog v-model="open" size="3xl">...</ODialog>
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
      id: 'backdrops',
      title: 'Backdrops',
      example: {
        component: 'DialogBackdrops',
        code: `<ODialog v-model="open" backdrop="opaque">...</ODialog>      <!-- dims the page -->
<ODialog v-model="open" backdrop="subtle">...</ODialog>      <!-- light dim -->
<ODialog v-model="open" backdrop="blur">...</ODialog>        <!-- light dim and blur -->
<ODialog v-model="open" backdrop="glass">...</ODialog>       <!-- frosted, no dim -->
<ODialog v-model="open" backdrop="transparent">...</ODialog> <!-- invisible, still blocks clicks -->

<!-- One default for every dialog and drawer in the app -->
app.use(OusiUIPlugin, { backdrop: 'blur' })

/* Tune the colors per theme */
--ousi-backdrop, --ousi-backdrop-subtle, --ousi-backdrop-glass`,
      },
    },
    {
      id: 'shadows',
      title: 'Shadows',
      example: {
        component: 'DialogShadows',
        code: `<ODialog v-model="open" shadow="md">...</ODialog>
<ODialog v-model="open" shadow="lg">...</ODialog>
<ODialog v-model="open" shadow="xl">...</ODialog>   <!-- default -->
<ODialog v-model="open" shadow="2xl">...</ODialog>`,
      },
    },
    {
      id: 'scrollable',
      title: 'Scrollable',
      example: {
        component: 'DialogScrollable',
        code: `<ODialog v-model="open" scroll-behavior="inside">
  <ODialogHeader>Scrollable Content</ODialogHeader>
  <ODialogBody>Long content here...</ODialogBody>
</ODialog>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled',
      example: {
        component: 'DialogControlled',
        code: `<ODialog v-model="isOpen" @open="onOpen" @close="onClose">
  <ODialogHeader>Controlled Dialog</ODialogHeader>
  <ODialogBody>Events fire on open/close.</ODialogBody>
</ODialog>`,
      },
    },
    {
      id: 'prevent-close',
      title: 'Prevent close',
      example: {
        component: 'DialogPreventClose',
        code: `<!-- Block ESC + backdrop click. The X button still closes. -->
<ODialog v-model="open" prevent-close>
  <ODialogHeader>Saving changes…</ODialogHeader>
  <ODialogBody>Please wait until the upload finishes.</ODialogBody>
</ODialog>

<!-- Force a choice: also hide the X. -->
<ODialog v-model="open" prevent-close hide-close-button>
  <ODialogHeader>Confirm payment</ODialogHeader>
  <ODialogFooter>
    <OButton variant="outline" @click="open = false">Cancel</OButton>
    <OButton @click="open = false">Confirm</OButton>
  </ODialogFooter>
</ODialog>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'boolean', description: 'Controls open/close state (v-model).' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'cover' | 'full'", default: "'md'", description: 'Width of the dialog, from 20rem (xs) to 64rem (5xl), never wider than the viewport. cover fills the viewport inside its margin; full fills it edge to edge.' },
    { name: 'shadow', type: "'md' | 'lg' | 'xl' | '2xl'", default: "'xl'", description: 'Elevation shadow.' },
    { name: 'placement', type: "'auto' | 'top' | 'center' | 'bottom'", default: "'center'", description: 'Vertical placement of the dialog.' },
    { name: 'backdrop', type: "'opaque' | 'subtle' | 'blur' | 'glass' | 'transparent'", default: "app config, 'opaque'", description: "Layer behind the dialog. Without it the dialog uses the plugin's backdrop option." },
    { name: 'scrollBehavior', type: "'inside' | 'outside'", default: "'inside'", description: 'How the body scrolls when content overflows.' },
    { name: 'hideCloseButton', type: 'boolean', default: 'false', description: 'Hide the built-in close button.' },
    { name: 'preventClose', type: 'boolean', default: 'false', description: 'Block dismissal via Escape key or backdrop click. The close button still works unless also hidden.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the dialog panel.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Dialog content (use ODialogHeader, ODialogBody, ODialogFooter).' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: boolean]', description: 'Emitted when open state changes.' },
    { name: 'open', type: '[]', description: 'Emitted when the dialog opens.' },
    { name: 'close', type: '[]', description: 'Emitted when the dialog closes.' },
  ],

  keyboard: [
    { key: 'escape', description: 'Closes the dialog. A list, popover or dialog opened above it closes first.' },
    { key: 'tab', description: 'Cycles focus within the dialog and the lists or popovers opened from it (focus trap).' },
  ],

  aria: [
    { attribute: 'role="dialog"', condition: 'always', description: 'Dialog has the dialog role.' },
    { attribute: 'aria-modal="true"', condition: 'always', description: 'Indicates the dialog is modal.' },
    { attribute: 'aria-labelledby', condition: 'when ODialogHeader has a title', description: 'Labels the dialog with the header title; the id is wired automatically.' },
    { attribute: 'focus', condition: 'open and close', description: 'On open, focus goes to an [autofocus] element, else the first field that is not a combobox, else the dialog. On close it returns to the element that opened it.' },
  ],

  bestPractices: [
    { text: 'Always provide a clear way to dismiss the dialog.', good: true },
    { text: 'Overlays stack in the order they open: a dialog opened from a drawer shows above it, whichever mounted first.', good: true },
    { text: 'Use scroll-behavior="inside" for long content to keep the footer visible.', good: true },
    { text: 'Pick the size by content: sm for a confirmation, md or lg for a short form, xl and up for forms in columns or tables.', good: true },
    { text: "Don't stack multiple dialogs. Consider a different UX pattern.", good: false },
  ],

  haptics: {
    defaultPreset: "'medium'",
    trigger: 'On open only (not on close)',
    notes: 'Provides a noticeable bump when a modal appears.',
  },
}
