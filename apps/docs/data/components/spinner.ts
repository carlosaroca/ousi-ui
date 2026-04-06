import type { ComponentData } from './types'

export const spinnerData: ComponentData = {
  title: 'Spinner',
  description: 'Animated loading indicator.',
  category: 'Feedback',
  importCode: "import { OSpinner } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'SpinnerBasic',
        code: '<OSpinner />',
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'SpinnerSizes',
        code: `<OSpinner size="sm" />
<OSpinner size="md" />
<OSpinner size="lg" />
<OSpinner size="xl" />`,
      },
    },
  ],

  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the spinner.' },
    { name: 'color', type: "'current' | 'accent' | 'danger' | 'success' | 'warning'", default: "'current'", description: 'Color of the spinner.' },
    { name: 'label', type: 'string', default: '-', description: 'Accessible label.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  aria: [
    { attribute: 'role="status"', condition: 'always', description: 'Announces loading state to assistive technologies.' },
    { attribute: 'aria-label', condition: 'label provided', description: 'Accessible name for the spinner.' },
  ],
}
