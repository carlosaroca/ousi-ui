import type { ComponentData } from './types'

export const progressCircleData: ComponentData = {
  title: 'Progress Circle',
  description: 'Circular progress indicator for compact layouts.',
  category: 'Feedback',
  importCode: "import { OProgressCircle } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ProgressCircleBasic',
        code: '<OProgressCircle :value="75" />',
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'ProgressCircleColors',
        code: `<OProgressCircle :value="75" color="default" />
<OProgressCircle :value="75" color="accent" />
<OProgressCircle :value="75" color="success" />
<OProgressCircle :value="75" color="warning" />
<OProgressCircle :value="75" color="danger" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'ProgressCircleSizes',
        code: `<OProgressCircle :value="75" size="sm" />
<OProgressCircle :value="75" size="md" />
<OProgressCircle :value="75" size="lg" />`,
      },
    },
    {
      id: 'indeterminate',
      title: 'Indeterminate',
      example: {
        component: 'ProgressCircleIndeterminate',
        code: `<!-- Omit :value to get a spinning indeterminate state -->
<OProgressCircle />
<OProgressCircle color="success" />
<OProgressCircle color="danger" />`,
      },
    },
    {
      id: 'with-label',
      title: 'With Label',
      example: {
        component: 'ProgressCircleWithLabel',
        code: '<OProgressCircle :value="75" show-value-label label="Progress" />',
      },
    },
  ],

  props: [
    { name: 'value', type: 'number', default: '-', description: 'Current value (0-100). Undefined = indeterminate.' },
    { name: 'minValue', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'maxValue', type: 'number', default: '100', description: 'Maximum value.' },
    { name: 'color', type: "'default' | 'accent' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Fill color.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the circle.' },
    { name: 'strokeWidth', type: 'number', default: '-', description: 'SVG stroke width.' },
    { name: 'showValueLabel', type: 'boolean', default: 'false', description: 'Show percentage in the center.' },
    { name: 'label', type: 'string', default: '-', description: 'Accessible label.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the progress circle.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  aria: [
    { attribute: 'role="progressbar"', condition: 'always', description: 'Identifies the element as a progress indicator.' },
    { attribute: 'aria-valuenow', condition: 'determinate', description: 'Current value.' },
    { attribute: 'aria-label', condition: 'label provided', description: 'Accessible name for the progress circle.' },
  ],
}
