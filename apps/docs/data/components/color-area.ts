import type { ComponentData } from './types'

export const colorAreaData: ComponentData = {
  title: 'Color Area',
  description: 'A two-dimensional area for selecting saturation and brightness at a given hue.',
  category: 'Colors',
  importCode: "import { OColorArea } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ColorAreaUsage',
        code: '<OColorArea v-model="value" :hue="hue" />',
      },
    },
    {
      id: 'with-slider',
      title: 'With Hue Slider',
      example: {
        component: 'ColorAreaWithSlider',
        code: `<OColorArea v-model="value" :hue="hue" />
<OColorSlider v-model="hue" channel="hue" label="Hue" />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: '{ x: number; y: number }', default: '{ x: 100, y: 100 }', description: 'Current value (v-model). x = saturation (0-100), y = brightness (0-100).' },
    { name: 'defaultValue', type: '{ x: number; y: number }', default: '-', description: 'Default value.' },
    { name: 'hue', type: 'number', default: '0', description: 'Hue angle 0-360.' },
    { name: 'showDots', type: 'boolean', default: 'false', description: 'Show dots overlay pattern.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '{ x: number; y: number }', description: 'Emitted when the value changes.' },
    { name: 'change', type: '{ x: number; y: number }', description: 'Emitted on user-initiated change.' },
  ],

  themeCode: `import { colorAreaTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'ArrowLeft', description: 'Decrease saturation (x) by one step.' },
    { key: 'ArrowRight', description: 'Increase saturation (x) by one step.' },
    { key: 'ArrowUp', description: 'Increase brightness (y) by one step.' },
    { key: 'ArrowDown', description: 'Decrease brightness (y) by one step.' },
  ],

  aria: [
    { attribute: 'role="slider"', condition: 'always', description: 'Exposed as a 2D slider.' },
    { attribute: 'aria-valuetext', condition: 'always', description: 'Describes the current saturation and brightness values.' },
    { attribute: 'aria-label', condition: 'always', description: 'Labels the color area for screen readers.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Marks the area as non-interactive.' },
  ],

  bestPractices: [
    { text: 'Pair with a hue slider for complete color selection.', good: true },
    { text: 'Provide a text representation of the selected color nearby.', good: true },
    { text: "Don't use color area in isolation — users need a hue control too.", good: false },
  ],
}
