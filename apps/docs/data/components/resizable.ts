import type { ComponentData } from './types'

export const resizableData: ComponentData = {
  title: 'Resizable',
  description: 'A split-pane component with a draggable divider for resizing two panels.',
  category: 'Layout',
  importCode: "import { OResizable } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ResizableBasic',
        code: `<OResizable direction="horizontal" :default-size="50" :min-size="20" :max-size="80">
  <template #first>
    <div class="p-4 bg-gray-100 h-full">Left Panel</div>
  </template>
  <template #second>
    <div class="p-4 bg-gray-200 h-full">Right Panel</div>
  </template>
</OResizable>`,
      },
    },
    {
      id: 'vertical',
      title: 'Vertical',
      example: {
        component: 'ResizableVertical',
        code: `<OResizable direction="vertical" :default-size="50" :min-size="20" :max-size="80">
  <template #first>
    <div class="p-4 bg-gray-100 h-full">Top Panel</div>
  </template>
  <template #second>
    <div class="p-4 bg-gray-200 h-full">Bottom Panel</div>
  </template>
</OResizable>`,
      },
    },
  ],

  props: [
    { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'The direction of the split.' },
    { name: 'defaultSize', type: 'number', default: '50', description: 'Initial size of the first panel as a percentage.' },
    { name: 'minSize', type: 'number', default: '20', description: 'Minimum size of the first panel as a percentage.' },
    { name: 'maxSize', type: 'number', default: '80', description: 'Maximum size of the first panel as a percentage.' },
  ],

  slots: [
    { name: 'first', type: 'slot', description: 'Content for the first (left or top) panel.' },
    { name: 'second', type: 'slot', description: 'Content for the second (right or bottom) panel.' },
  ],

  emits: [
    { name: 'resize', type: '[size: number]', description: 'Emitted when the panel is resized, with the new percentage.' },
  ],

  bestPractices: [
    { text: 'Set reasonable min and max sizes to prevent panels from becoming unusable.', good: true },
    { text: 'Wrap the resizable in a container with a defined height for vertical mode.', good: true },
    { text: "Don't set min and max to the same value, which would disable resizing.", good: false },
  ],
}
