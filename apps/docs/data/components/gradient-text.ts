import type { ComponentData } from './types'

export const gradientTextData: ComponentData = {
  title: 'Gradient Text',
  description: 'Apply beautiful gradient colors to text with presets or custom stops.',
  category: 'Typography',
  importCode: "import { OGradientText } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'GradientTextBasic',
        code: `<OGradientText preset="aurora">
  <h2>Beautiful Aurora Gradient</h2>
</OGradientText>`,
      },
    },
    {
      id: 'presets',
      title: 'Presets',
      example: {
        component: 'GradientTextPresets',
        code: `<OGradientText preset="aurora"><h3>Aurora</h3></OGradientText>
<OGradientText preset="ocean"><h3>Ocean</h3></OGradientText>
<OGradientText preset="sunset"><h3>Sunset</h3></OGradientText>
<OGradientText preset="forest"><h3>Forest</h3></OGradientText>
<OGradientText preset="candy"><h3>Candy</h3></OGradientText>`,
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'GradientTextAnimated',
        code: `<OGradientText preset="ocean" animate :duration="3">
  <h2>Flowing Ocean Gradient</h2>
</OGradientText>`,
      },
    },
    {
      id: 'custom',
      title: 'Custom Colors',
      example: {
        component: 'GradientTextBasic',
        code: `<OGradientText from="#ff6b6b" via="#feca57" to="#48dbfb">
  <h2>Custom Gradient</h2>
</OGradientText>`,
      },
    },
  ],

  props: [
    { name: 'preset', type: "'aurora' | 'ocean' | 'sunset' | 'forest' | 'candy'", default: '-', description: 'Predefined gradient color scheme.' },
    { name: 'from', type: 'string', default: '-', description: 'Starting color of the gradient (CSS color value).' },
    { name: 'via', type: 'string', default: '-', description: 'Optional middle color of the gradient (CSS color value).' },
    { name: 'to', type: 'string', default: '-', description: 'Ending color of the gradient (CSS color value).' },
    { name: 'animate', type: 'boolean', default: 'false', description: 'Enable a smooth flowing animation on the gradient.' },
    { name: 'duration', type: 'number', default: '3', description: 'Animation cycle duration in seconds.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'The text content to apply the gradient to.' },
  ],
}
