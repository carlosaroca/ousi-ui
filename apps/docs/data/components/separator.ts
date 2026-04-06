import type { ComponentData } from './types'

export const separatorData: ComponentData = {
  title: 'Separator',
  description: 'Visual divider between sections of content.',
  category: 'Layout',
  importCode: "import { OSeparator } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SeparatorBasic',
        code: `<p>Above</p>
<OSeparator />
<p>Below</p>`,
      },
    },
    {
      id: 'vertical',
      title: 'Vertical',
      example: {
        component: 'SeparatorVertical',
        code: `<div class="flex items-center gap-4 h-6">
  <span>Left</span>
  <OSeparator orientation="vertical" />
  <span>Right</span>
</div>`,
      },
    },
    {
      id: 'with-label',
      title: 'With Label',
      example: {
        component: 'SeparatorWithLabel',
        code: `<OSeparator>or continue with</OSeparator>`,
      },
    },
  ],

  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction.' },
    { name: 'variant', type: "'default' | 'secondary' | 'tertiary'", default: "'default'", description: 'Color variant.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Optional label displayed in the center of the separator.' },
  ],

  aria: [
    { attribute: 'role="separator"', condition: 'always', description: 'Identifies the element as a separator.' },
    { attribute: 'aria-orientation', condition: 'always', description: 'Indicates horizontal or vertical orientation.' },
  ],
}
