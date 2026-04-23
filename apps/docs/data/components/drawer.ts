import type { ComponentData } from './types'

export const drawerData: ComponentData = {
  title: 'Drawer',
  description: 'A panel that slides in from the edge of the viewport.',
  category: 'Overlays',
  importCode: "import { ODrawer } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DrawerUsage',
        code: `<OButton @click="open = true">Open Drawer</OButton>
<ODrawer v-model="open" title="Drawer Title">
  <p>Drawer content goes here.</p>
</ODrawer>`,
      },
    },
    {
      id: 'placements',
      title: 'Placements',
      example: {
        component: 'DrawerPlacements',
        code: `<ODrawer v-model="open" placement="left">Left</ODrawer>
<ODrawer v-model="open" placement="right">Right</ODrawer>
<ODrawer v-model="open" placement="top">Top</ODrawer>
<ODrawer v-model="open" placement="bottom">Bottom</ODrawer>`,
      },
    },
    {
      id: 'shadows',
      title: 'Shadows',
      example: {
        component: 'DrawerShadows',
        code: `<ODrawer v-model="open" shadow="md">...</ODrawer>
<ODrawer v-model="open" shadow="lg">...</ODrawer>
<ODrawer v-model="open" shadow="xl">...</ODrawer>   <!-- default -->
<ODrawer v-model="open" shadow="2xl">...</ODrawer>`,
      },
    },
    {
      id: 'with-form',
      title: 'With Form',
      example: {
        component: 'DrawerWithForm',
        code: `<ODrawer v-model="open" title="Edit Profile">
  <form class="flex flex-col gap-4">
    <OInput label="Name" v-model="name" />
    <OButton type="submit">Save</OButton>
  </form>
</ODrawer>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'boolean', description: 'Controls open/close state (v-model).' },
    { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right' | 'floating-center' | 'floating-left' | 'floating-right' | 'floating-top' | 'floating-bottom'", default: "'right'", description: 'Direction from which the drawer slides in.' },
    { name: 'shadow', type: "'md' | 'lg' | 'xl' | '2xl'", default: "'xl'", description: 'Elevation shadow.' },
    { name: 'backdrop', type: "'opaque' | 'blur' | 'transparent'", default: "'opaque'", description: 'Backdrop style.' },
    { name: 'showHandle', type: 'boolean', default: '-', description: 'Show a drag handle bar.' },
    { name: 'showCloseButton', type: 'boolean', default: '-', description: 'Show the built-in close button.' },
    { name: 'title', type: 'string', description: 'Title text in the header.' },
    { name: 'description', type: 'string', description: 'Description text in the header.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes on the drawer panel.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: boolean]', description: 'Emitted when open state changes.' },
    { name: 'open', type: '[]', description: 'Emitted when the drawer opens.' },
    { name: 'close', type: '[]', description: 'Emitted when the drawer closes.' },
  ],

  keyboard: [
    { key: 'escape', description: 'Closes the drawer.' },
    { key: 'tab', description: 'Cycles focus within the drawer (focus trap).' },
  ],

  aria: [
    { attribute: 'role="dialog"', condition: 'always', description: 'Drawer has the dialog role.' },
    { attribute: 'aria-modal="true"', condition: 'always', description: 'Indicates the drawer is modal.' },
    { attribute: 'aria-labelledby', condition: 'when title present', description: 'Labels the drawer with the title.' },
  ],

  bestPractices: [
    { text: 'Use drawers for secondary tasks that do not require a full page.', good: true },
    { text: 'Provide a title so screen readers announce the drawer purpose.', good: true },
    { text: "Don't use drawers for critical actions that require full attention.", good: false },
  ],
}
