import type { ComponentData } from './types'

export const bentoGridData: ComponentData = {
  title: 'BentoGrid',
  description: 'A grid layout inspired by bento boxes for showcasing content in varying sizes.',
  category: 'Layout',
  importCode: "import { OBentoGrid, OBentoGridItem } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'BentoGridBasic',
        code: `<OBentoGrid :cols="3" :gap="16">
  <OBentoGridItem :col-span="2">Wide item</OBentoGridItem>
  <OBentoGridItem>Item 2</OBentoGridItem>
  <OBentoGridItem>Item 3</OBentoGridItem>
  <OBentoGridItem>Item 4</OBentoGridItem>
  <OBentoGridItem>Item 5</OBentoGridItem>
  <OBentoGridItem>Item 6</OBentoGridItem>
</OBentoGrid>`,
      },
    },
    {
      id: 'spanning',
      title: 'Spanning',
      example: {
        component: 'BentoGridSpanning',
        code: `<OBentoGrid :cols="4" :gap="12">
  <OBentoGridItem :col-span="2" :row-span="2">Featured</OBentoGridItem>
  <OBentoGridItem>Item A</OBentoGridItem>
  <OBentoGridItem>Item B</OBentoGridItem>
  <OBentoGridItem :col-span="2">Wide</OBentoGridItem>
</OBentoGrid>`,
      },
    },
  ],

  props: [
    { name: 'cols', type: '2 | 3 | 4', default: '3', description: 'Number of columns in the grid.' },
    { name: 'gap', type: 'number', default: '16', description: 'Gap between grid items in pixels.' },
    { name: 'colSpan', type: 'number', default: '1', description: '(OBentoGridItem) Number of columns the item spans.' },
    { name: 'rowSpan', type: 'number', default: '1', description: '(OBentoGridItem) Number of rows the item spans.' },
  ],

  bestPractices: [
    { text: 'Use spanning to highlight featured or important content.', good: true },
    { text: 'Keep consistent padding inside grid items for visual harmony.', good: true },
    { text: "Don't span items beyond the total column count.", good: false },
  ],
}
