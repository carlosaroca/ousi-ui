import type { ComponentData } from './types'

export const scrollShadowData: ComponentData = {
  title: 'Scroll Shadow',
  description: 'A container that shows fade shadows when content overflows.',
  category: 'Utilities',
  importCode: "import { OScrollShadow } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ScrollShadowUsage',
        code: `<OScrollShadow class="h-48">
  <div class="space-y-4">
    <p v-for="i in 20" :key="i">Item {{ i }}</p>
  </div>
</OScrollShadow>`,
      },
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      example: {
        component: 'ScrollShadowHorizontal',
        code: `<OScrollShadow orientation="horizontal" class="w-64">
  <div class="flex gap-4 w-[800px]">
    <div v-for="i in 10" :key="i" class="shrink-0 w-24 h-24 rounded bg-ousi-muted" />
  </div>
</OScrollShadow>`,
      },
    },
    {
      id: 'custom-size',
      title: 'Custom Size',
      example: {
        component: 'ScrollShadowCustomSize',
        code: `<OScrollShadow :size="80" class="h-48">
  <div class="space-y-4">
    <p v-for="i in 20" :key="i">Item {{ i }}</p>
  </div>
</OScrollShadow>`,
      },
    },
    {
      id: 'with-scrollbar',
      title: 'With Scrollbar',
      example: {
        component: 'ScrollShadowWithScrollbar',
        code: `<OScrollShadow :hide-scrollbar="false" class="h-48">
  <div class="space-y-4">
    <p v-for="i in 20" :key="i">Item {{ i }}</p>
  </div>
</OScrollShadow>`,
      },
    },
  ],

  props: [
    { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Scroll direction.' },
    { name: 'size', type: 'number', default: '40', description: 'Fade size in px.' },
    { name: 'hideScrollbar', type: 'boolean', default: 'true', description: 'Hide the native scrollbar.' },
    { name: 'offset', type: 'number', default: '0', description: 'Scroll offset before activating the fade.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
    { name: 'style', type: 'any', default: '-', description: 'Inline styles.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Scrollable content.' },
  ],

  bestPractices: [
    { text: 'Set a fixed height or width so the shadow effect is visible.', good: true },
    { text: 'Use orientation="both" for two-axis scrollable areas.', good: true },
    { text: "Don't hide the scrollbar when users need precise scroll control.", good: false },
  ],
}
