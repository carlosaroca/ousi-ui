import type { ComponentData } from './types'

export const alertData: ComponentData = {
  title: 'Alert',
  description: 'Contextual feedback messages for user actions.',
  category: 'Feedback',
  importCode: "import { OAlert } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'AlertBasic',
        code: '<OAlert title="Heads up!" />',
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'AlertVariants',
        code: `<OAlert variant="default" title="Default alert" />
<OAlert variant="accent" title="Accent alert" />
<OAlert variant="success" title="Success alert" />
<OAlert variant="warning" title="Warning alert" />
<OAlert variant="danger" title="Danger alert" />`,
      },
    },
    {
      id: 'shadows',
      title: 'Shadows',
      example: {
        component: 'AlertShadows',
        code: `<OAlert shadow="none" title="shadow none" />   <!-- default -->
<OAlert shadow="xs" title="shadow xs" />
<OAlert shadow="sm" title="shadow sm" />
<OAlert shadow="md" title="shadow md" />
<OAlert shadow="lg" title="shadow lg" />`,
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'AlertWithDescription',
        code: `<OAlert
  variant="success"
  title="Payment successful"
  description="Your payment of $49.99 has been processed."
/>`,
      },
    },
    {
      id: 'closable',
      title: 'Closable',
      example: {
        component: 'AlertClosable',
        code: `<OAlert
  v-if="visible"
  title="Dismissible alert"
  closable
  @close="visible = false"
/>`,
      },
    },
  ],

  props: [
    { name: 'variant', type: "'default' | 'accent' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Color variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md' | 'lg'", default: "'none'", description: 'Elevation shadow.' },
    { name: 'title', type: 'string', default: '-', description: 'Title text (required).' },
    { name: 'description', type: 'string', default: '-', description: 'Description text.' },
    { name: 'closable', type: 'boolean', default: 'false', description: 'Show a close button.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'close', type: '() => void', description: 'Fired when the close button is clicked.' },
  ],

  aria: [
    { attribute: 'role="alert"', condition: 'always', description: 'Announces the alert to assistive technologies.' },
  ],
}
