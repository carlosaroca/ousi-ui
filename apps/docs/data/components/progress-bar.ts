import type { ComponentData } from './types'

export const progressBarData: ComponentData = {
  title: 'Progress Bar',
  description: 'Horizontal bar indicating task completion progress.',
  category: 'Feedback',
  importCode: "import { OProgressBar } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ProgressBarBasic',
        code: '<OProgressBar :value="60" />',
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'ProgressBarColors',
        code: `<OProgressBar :value="60" color="default" />
<OProgressBar :value="60" color="accent" />
<OProgressBar :value="60" color="success" />
<OProgressBar :value="60" color="warning" />
<OProgressBar :value="60" color="danger" />`,
      },
    },
    {
      id: 'sizes',
      title: 'Sizes',
      example: {
        component: 'ProgressBarSizes',
        code: `<OProgressBar :value="60" size="sm" />
<OProgressBar :value="60" size="md" />
<OProgressBar :value="60" size="lg" />`,
      },
    },
    {
      id: 'with-label',
      title: 'With Label',
      example: {
        component: 'ProgressBarWithLabel',
        code: `<OProgressBar :value="60" label="Uploading..." show-value-label />`,
      },
    },
    {
      id: 'indeterminate',
      title: 'Indeterminate',
      example: {
        component: 'ProgressBarIndeterminate',
        code: '<OProgressBar label="Loading..." />',
      },
    },
  ],

  props: [
    { name: 'value', type: 'number', default: '-', description: 'Current value (0-100). Undefined = indeterminate.' },
    { name: 'minValue', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'maxValue', type: 'number', default: '100', description: 'Maximum value.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'showValueLabel', type: 'boolean', default: 'false', description: 'Show value percentage on the right.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', default: '-', description: 'Format options for the value display.' },
    { name: 'color', type: "'default' | 'accent' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Color of the fill bar.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the track.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the progress bar.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  aria: [
    { attribute: 'role="progressbar"', condition: 'always', description: 'Identifies the element as a progress bar.' },
    { attribute: 'aria-valuenow', condition: 'determinate', description: 'Current value of the progress bar.' },
    { attribute: 'aria-valuemin', condition: 'always', description: 'Minimum value of the range.' },
    { attribute: 'aria-valuemax', condition: 'always', description: 'Maximum value of the range.' },
  ],
}
