import type { ComponentData } from './types'

export const aspectRatioData: ComponentData = {
  title: 'AspectRatio',
  description: 'Maintains a consistent width-to-height ratio for its content.',
  category: 'Layout',
  importCode: "import { OAspectRatio } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'AspectRatioBasic',
        code: `<OAspectRatio :ratio="16 / 9">
  <div class="w-full h-full bg-gray-100 rounded flex items-center justify-center">
    16:9
  </div>
</OAspectRatio>`,
      },
    },
    {
      id: 'ratios',
      title: 'Ratios',
      example: {
        component: 'AspectRatioVariants',
        code: `<div class="grid grid-cols-3 gap-4">
  <OAspectRatio :ratio="1">
    <div class="w-full h-full bg-blue-100 rounded flex items-center justify-center">1:1</div>
  </OAspectRatio>
  <OAspectRatio :ratio="4 / 3">
    <div class="w-full h-full bg-green-100 rounded flex items-center justify-center">4:3</div>
  </OAspectRatio>
  <OAspectRatio :ratio="16 / 9">
    <div class="w-full h-full bg-purple-100 rounded flex items-center justify-center">16:9</div>
  </OAspectRatio>
</div>`,
      },
    },
  ],

  props: [
    { name: 'ratio', type: 'number', default: '16 / 9', description: 'The desired width-to-height ratio (e.g. 16/9, 4/3, 1).' },
  ],

  bestPractices: [
    { text: 'Use aspect ratio for images and videos to prevent layout shifts.', good: true },
    { text: 'Combine with responsive width utilities for fluid layouts.', good: true },
    { text: "Don't use extremely unusual ratios that distort content.", good: false },
  ],
}
