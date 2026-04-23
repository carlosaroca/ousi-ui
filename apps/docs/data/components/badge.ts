import type { ComponentData } from './types'

export const badgeData: ComponentData = {
  title: 'Badge',
  description: 'Small status indicator anchored to an element.',
  category: 'Data Display',
  importCode: "import { OBadge } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'BadgeBasic',
        code: `<OBadge content="5">
  <OButton>Notifications</OButton>
</OBadge>`,
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'BadgeColors',
        code: `<OBadge color="default" content="3"><OButton variant="outline">Default</OButton></OBadge>
<OBadge color="accent" content="3"><OButton variant="outline">Accent</OButton></OBadge>
<OBadge color="success" content="3"><OButton variant="outline">Success</OButton></OBadge>
<OBadge color="warning" content="3"><OButton variant="outline">Warning</OButton></OBadge>
<OBadge color="danger" content="3"><OButton variant="outline">Danger</OButton></OBadge>`,
      },
    },
    {
      id: 'content',
      title: 'Content',
      example: {
        component: 'BadgeContent',
        code: `<OBadge content="5"><OButton variant="outline">Count</OButton></OBadge>
<OBadge content="99" :max="99"><OButton variant="outline">Max</OButton></OBadge>
<OBadge content="150" :max="99"><OButton variant="outline">Overflow</OButton></OBadge>`,
      },
    },
    {
      id: 'dot',
      title: 'Dot',
      example: {
        component: 'BadgeDot',
        code: `<OBadge dot>
  <OButton variant="outline">Messages</OButton>
</OBadge>`,
      },
    },
    {
      id: 'placement',
      title: 'Placement',
      example: {
        component: 'BadgePlacement',
        code: `<OBadge content="1" placement="top-right"><OButton variant="outline">Top Right</OButton></OBadge>
<OBadge content="2" placement="top-left"><OButton variant="outline">Top Left</OButton></OBadge>
<OBadge content="3" placement="bottom-right"><OButton variant="outline">Bottom Right</OButton></OBadge>
<OBadge content="4" placement="bottom-left"><OButton variant="outline">Bottom Left</OButton></OBadge>`,
      },
    },
  ],

  props: [
    { name: 'content', type: 'string | number', default: '-', description: 'Text or number inside the badge.' },
    { name: 'color', type: "'default' | 'accent' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Color scheme.' },
    { name: 'variant', type: "'primary' | 'secondary' | 'soft'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the badge.' },
    { name: 'placement', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'top-right'", description: 'Position when anchored on an element.' },
    { name: 'showZero', type: 'boolean', default: 'false', description: 'Show badge when content is 0.' },
    { name: 'max', type: 'number', default: '-', description: 'If content > max, shows "max+".' },
    { name: 'dot', type: 'boolean', default: 'false', description: 'Show as a small dot without content.' },
    { name: 'invisible', type: 'boolean', default: 'false', description: 'Hide the badge without removing from DOM.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: 'slot', description: 'The element the badge is anchored to.' },
  ],
}
