import type { ComponentData } from './types'

export const chipData: ComponentData = {
  title: 'Chip',
  description: 'Compact element for labels, tags, or categories.',
  category: 'Data Display',
  importCode: "import { OChip } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ChipBasic',
        code: '<OChip>Default</OChip>',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'ChipVariants',
        code: `<OChip variant="solid">Solid</OChip>
<OChip variant="outline">Outline</OChip>
<OChip variant="soft">Soft</OChip>
<OChip variant="ghost">Ghost</OChip>`,
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'ChipColors',
        code: `<OChip color="accent">Accent</OChip>
<OChip color="success">Success</OChip>
<OChip color="warning">Warning</OChip>
<OChip color="danger">Danger</OChip>
<OChip color="default">Default</OChip>`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'ChipSizes',
        code: `<OChip size="sm">Small</OChip>
<OChip size="md">Medium</OChip>
<OChip size="lg">Large</OChip>`,
      },
    },
    {
      id: 'closable',
      title: 'Closable',
      example: {
        component: 'ChipClosable',
        code: `<OChip>
  Closable
  <template #end>
    <button @click="onClose">&times;</button>
  </template>
</OChip>`,
      },
    },
    {
      id: 'with-avatar',
      title: 'With Avatar',
      example: {
        component: 'ChipWithAvatar',
        code: `<OChip>
  <template #start>
    <OAvatar src="/avatar.jpg" size="sm" />
  </template>
  John Doe
</OChip>`,
      },
    },
  ],

  props: [
    { name: 'variant', type: "'solid' | 'outline' | 'soft' | 'ghost'", default: "'solid'", description: 'Visual style of the chip.' },
    { name: 'color', type: "'accent' | 'success' | 'warning' | 'danger' | 'default'", default: "'accent'", description: 'Color scheme.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the chip.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'Chip label content.' },
    { name: 'start', type: 'slot', description: 'Content before the label (avatar, icon).' },
    { name: 'end', type: 'slot', description: 'Content after the label (close button).' },
  ],
}
