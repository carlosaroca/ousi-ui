import type { ComponentData } from './types'

export const colorSwatchData: ComponentData = {
  title: 'Color Swatch',
  description: 'A small visual preview of a color value.',
  category: 'Colors',
  importCode: "import { OColorSwatch } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ColorSwatchUsage',
        code: '<OColorSwatch color="#3b82f6" />',
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'ColorSwatchSizes',
        code: `<OColorSwatch color="#3b82f6" size="xs" />
<OColorSwatch color="#3b82f6" size="sm" />
<OColorSwatch color="#3b82f6" size="md" />
<OColorSwatch color="#3b82f6" size="lg" />
<OColorSwatch color="#3b82f6" size="xl" />`,
      },
    },
    {
      id: 'shapes',
      title: 'Shapes',
      example: {
        component: 'ColorSwatchShapes',
        code: `<OColorSwatch color="#ef4444" shape="square" />
<OColorSwatch color="#ef4444" shape="circle" />`,
      },
    },
  ],

  props: [
    { name: 'color', type: 'string', description: 'Any valid CSS color value.' },
    { name: 'shape', type: "'circle' | 'square'", default: "'square'", description: 'Shape of the swatch.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the swatch.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  themeCode: `import { colorSwatchTheme } from '@ousi-ui/vue'

// CVA shapes: circle, square
// CVA sizes: xs, sm, md, lg, xl`,

  aria: [
    { attribute: 'role="img"', condition: 'always', description: 'Swatch is treated as a decorative image.' },
    { attribute: 'aria-label', condition: 'always', description: 'Describes the displayed color value.' },
  ],

  bestPractices: [
    { text: 'Pair with a text label when color identification is important.', good: true },
    { text: "Don't rely on color alone to convey meaning — add text or icons.", good: false },
  ],
}
