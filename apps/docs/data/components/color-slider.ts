import type { ComponentData } from './types'

export const colorSliderData: ComponentData = {
  title: 'Color Slider',
  description: 'A slider for adjusting a single color channel such as hue, saturation, or alpha.',
  category: 'Colors',
  importCode: "import { OColorSlider } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ColorSliderUsage',
        code: '<OColorSlider v-model="hue" channel="hue" label="Hue" />',
      },
    },
    {
      id: 'channels',
      title: 'Channels',
      example: {
        component: 'ColorSliderChannels',
        code: `<OColorSlider v-model="hue" channel="hue" label="Hue" />
<OColorSlider v-model="saturation" channel="saturation" label="Saturation" />
<OColorSlider v-model="alpha" channel="alpha" label="Alpha" />`,
      },
    },
    {
      id: 'vertical',
      title: 'Vertical',
      example: {
        component: 'ColorSliderVertical',
        code: '<OColorSlider v-model="hue" channel="hue" label="Hue" orientation="vertical" />',
      },
    },
  ],

  props: [
    { name: 'channel', type: "'hue' | 'saturation' | 'lightness' | 'alpha' | 'red' | 'green' | 'blue'", description: 'Which color channel this slider controls.' },
    { name: 'modelValue', type: 'number', default: '-', description: 'Current value (v-model).' },
    { name: 'defaultValue', type: 'number', default: '-', description: 'Default value.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'showOutput', type: 'boolean', default: 'false', description: 'Show numeric output.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
    { name: 'contextColor', type: '{ h?, s?, l?, a?, r?, g?, b? }', default: '-', description: 'Context color for gradient generation.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'number', description: 'Emitted when the value changes.' },
    { name: 'change', type: 'number', description: 'Emitted on user-initiated change.' },
  ],

  themeCode: `import { colorSliderTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'ArrowLeft / ArrowDown', description: 'Decrease the value by one step.' },
    { key: 'ArrowRight / ArrowUp', description: 'Increase the value by one step.' },
    { key: 'Home', description: 'Set to minimum value.' },
    { key: 'End', description: 'Set to maximum value.' },
    { key: 'PageUp', description: 'Increase by a larger step.' },
    { key: 'PageDown', description: 'Decrease by a larger step.' },
  ],

  aria: [
    { attribute: 'role="slider"', condition: 'always', description: 'Exposed as a slider control.' },
    { attribute: 'aria-valuemin', condition: 'always', description: 'Minimum value for the channel.' },
    { attribute: 'aria-valuemax', condition: 'always', description: 'Maximum value for the channel.' },
    { attribute: 'aria-valuenow', condition: 'always', description: 'Current slider value.' },
    { attribute: 'aria-label', condition: 'label prop set', description: 'Labels the slider.' },
    { attribute: 'aria-orientation', condition: 'always', description: 'Indicates horizontal or vertical orientation.' },
    { attribute: 'aria-disabled', condition: 'disabled', description: 'Marks slider as non-interactive.' },
  ],

  bestPractices: [
    { text: 'Always provide a label describing the color channel.', good: true },
    { text: 'Use contextColor so the gradient accurately reflects the current color.', good: true },
    { text: "Don't forget to set aria-label when label is visually hidden.", good: false },
  ],
}
